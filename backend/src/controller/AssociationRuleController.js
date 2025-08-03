import Order from "../models/Orders.js";
import Product from "../models/Product.js";

class AssociationRuleController {
    constructor() {
        this.minSupport = 0.01; // 1% minimum support
        this.minConfidence = 0.5; // 50% minimum confidence
        this.minLift = 1.0; // Minimum lift threshold
    }

    // Get all orders and group by user to create transactions
    async getTransactions(req, res) {
        try {
            const orders = await Order.find({}).populate('productId');
            
            // Group orders by user to create transactions
            const userTransactions = {};
            orders.forEach(order => {
                if (!userTransactions[order.orderedBy]) {
                    userTransactions[order.orderedBy] = [];
                }
                userTransactions[order.orderedBy].push(order.productId._id.toString());
            });

            // Convert to array of transactions
            const transactions = Object.values(userTransactions);
            
            res.status(200).json({
                transactions: transactions,
                totalTransactions: transactions.length,
                totalOrders: orders.length
            });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    // Generate frequent item sets using Apriori algorithm
    async generateFrequentItemsets(req, res) {
        try {
            const { minSupport = 0.01 } = req.query;
            this.minSupport = parseFloat(minSupport);

            const orders = await Order.find({}).populate('productId');
            
            // Group orders by user to create transactions
            const userTransactions = {};
            orders.forEach(order => {
                if (!userTransactions[order.orderedBy]) {
                    userTransactions[order.orderedBy] = [];
                }
                userTransactions[order.orderedBy].push(order.productId._id.toString());
            });

            const transactions = Object.values(userTransactions);
            const frequentItemsets = this.apriori(transactions);

            res.status(200).json({
                frequentItemsets: frequentItemsets,
                minSupport: this.minSupport,
                totalTransactions: transactions.length
            });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    // Generate association rules from frequent item sets
    async generateAssociationRules(req, res) {
        try {
            const { minConfidence = 0.5, minLift = 1.0 } = req.query;
            this.minConfidence = parseFloat(minConfidence);
            this.minLift = parseFloat(minLift);

            const orders = await Order.find({}).populate('productId');
            
            // Group orders by user to create transactions
            const userTransactions = {};
            orders.forEach(order => {
                if (!userTransactions[order.orderedBy]) {
                    userTransactions[order.orderedBy] = [];
                }
                userTransactions[order.orderedBy].push(order.productId._id.toString());
            });

            const transactions = Object.values(userTransactions);
            const frequentItemsets = this.apriori(transactions);
            const associationRules = this.generateRules(frequentItemsets, transactions);

            // Get product details for better readability
            const productIds = [...new Set(associationRules.flatMap(rule => [rule.antecedent, rule.consequent]))];
            const products = await Product.find({ _id: { $in: productIds } });
            const productMap = {};
            products.forEach(product => {
                productMap[product._id.toString()] = product.name;
            });

            // Add product names to rules
            const rulesWithNames = associationRules.map(rule => ({
                ...rule,
                antecedentName: productMap[rule.antecedent] || 'Unknown Product',
                consequentName: productMap[rule.consequent] || 'Unknown Product'
            }));

            res.status(200).json({
                associationRules: rulesWithNames,
                minSupport: this.minSupport,
                minConfidence: this.minConfidence,
                minLift: this.minLift,
                totalRules: rulesWithNames.length
            });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    // Get recommendations based on association rules
    async getRecommendations(req, res) {
        try {
            const { productId } = req.params;
            const { limit = 5 } = req.query;

            const orders = await Order.find({}).populate('productId');
            
            // Group orders by user to create transactions
            const userTransactions = {};
            orders.forEach(order => {
                if (!userTransactions[order.orderedBy]) {
                    userTransactions[order.orderedBy] = [];
                }
                userTransactions[order.orderedBy].push(order.productId._id.toString());
            });

            const transactions = Object.values(userTransactions);
            const frequentItemsets = this.apriori(transactions);
            const associationRules = this.generateRules(frequentItemsets, transactions);

            // Find rules where the given product is in the antecedent
            const relevantRules = associationRules.filter(rule => 
                rule.antecedent === productId
            );

            // Sort by confidence and lift
            relevantRules.sort((a, b) => {
                if (b.confidence !== a.confidence) {
                    return b.confidence - a.confidence;
                }
                return b.lift - a.lift;
            });

            // Get recommended product IDs
            const recommendedProductIds = relevantRules
                .slice(0, parseInt(limit))
                .map(rule => rule.consequent);

            // Get product details
            const recommendedProducts = await Product.find({ 
                _id: { $in: recommendedProductIds } 
            });

            res.status(200).json({
                recommendations: recommendedProducts,
                rules: relevantRules.slice(0, parseInt(limit)),
                totalRules: relevantRules.length
            });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    // Apriori algorithm implementation
    apriori(transactions) {
        const frequentItemsets = [];
        const itemCounts = {};
        const totalTransactions = transactions.length;

        // Count individual items
        transactions.forEach(transaction => {
            transaction.forEach(item => {
                itemCounts[item] = (itemCounts[item] || 0) + 1;
            });
        });

        // Generate 1-itemsets
        const oneItemsets = Object.entries(itemCounts)
            .filter(([item, count]) => count / totalTransactions >= this.minSupport)
            .map(([item, count]) => ({
                items: [item],
                support: count / totalTransactions,
                count: count
            }));

        frequentItemsets.push(...oneItemsets);

        // Generate k-itemsets (k > 1)
        let k = 2;
        let currentItemsets = oneItemsets;

        while (currentItemsets.length > 0) {
            const candidates = this.generateCandidates(currentItemsets, k);
            const kItemsets = [];

            candidates.forEach(candidate => {
                const support = this.calculateSupport(candidate, transactions);
                if (support >= this.minSupport) {
                    kItemsets.push({
                        items: candidate,
                        support: support,
                        count: Math.round(support * totalTransactions)
                    });
                }
            });

            if (kItemsets.length > 0) {
                frequentItemsets.push(...kItemsets);
                currentItemsets = kItemsets;
                k++;
            } else {
                break;
            }
        }

        return frequentItemsets;
    }

    // Generate candidate itemsets
    generateCandidates(prevItemsets, k) {
        const candidates = [];
        const n = prevItemsets.length;

        for (let i = 0; i < n; i++) {
            for (let j = i + 1; j < n; j++) {
                const itemset1 = prevItemsets[i].items;
                const itemset2 = prevItemsets[j].items;

                // Check if first k-2 elements are the same
                let canMerge = true;
                for (let m = 0; m < k - 2; m++) {
                    if (itemset1[m] !== itemset2[m]) {
                        canMerge = false;
                        break;
                    }
                }

                if (canMerge && itemset1[k - 2] < itemset2[k - 2]) {
                    const newCandidate = [...itemset1, itemset2[k - 2]];
                    candidates.push(newCandidate);
                }
            }
        }

        return candidates;
    }

    // Calculate support for an itemset
    calculateSupport(itemset, transactions) {
        let count = 0;
        transactions.forEach(transaction => {
            if (itemset.every(item => transaction.includes(item))) {
                count++;
            }
        });
        return count / transactions.length;
    }

    // Generate association rules from frequent itemsets
    generateRules(frequentItemsets, transactions) {
        const rules = [];
        const totalTransactions = transactions.length;

        frequentItemsets.forEach(itemset => {
            if (itemset.items.length < 2) return;

            const items = itemset.items;
            const support = itemset.support;

            // Generate all possible rules
            for (let i = 1; i < items.length; i++) {
                const combinations = this.getCombinations(items, i);
                
                combinations.forEach(antecedent => {
                    const consequent = items.filter(item => !antecedent.includes(item));
                    
                    if (consequent.length > 0) {
                        const antecedentSupport = this.calculateSupport(antecedent, transactions);
                        const confidence = support / antecedentSupport;
                        const consequentSupport = this.calculateSupport(consequent, transactions);
                        const lift = confidence / consequentSupport;

                        if (confidence >= this.minConfidence && lift >= this.minLift) {
                            rules.push({
                                antecedent: antecedent[0], // For simplicity, take first item
                                consequent: consequent[0], // For simplicity, take first item
                                support: support,
                                confidence: confidence,
                                lift: lift,
                                antecedentSupport: antecedentSupport,
                                consequentSupport: consequentSupport
                            });
                        }
                    }
                });
            }
        });

        return rules;
    }

    // Get all combinations of items of given size
    getCombinations(items, size) {
        if (size === 0) return [[]];
        if (size > items.length) return [];

        const combinations = [];
        
        const generateCombinations = (start, current) => {
            if (current.length === size) {
                combinations.push([...current]);
                return;
            }

            for (let i = start; i < items.length; i++) {
                current.push(items[i]);
                generateCombinations(i + 1, current);
                current.pop();
            }
        };

        generateCombinations(0, []);
        return combinations;
    }

    // Get analytics about association rules
    async getAnalytics(req, res) {
        try {
            const orders = await Order.find({}).populate('productId');
            
            // Group orders by user to create transactions
            const userTransactions = {};
            orders.forEach(order => {
                if (!userTransactions[order.orderedBy]) {
                    userTransactions[order.orderedBy] = [];
                }
                userTransactions[order.orderedBy].push(order.productId._id.toString());
            });

            const transactions = Object.values(userTransactions);
            const frequentItemsets = this.apriori(transactions);
            const associationRules = this.generateRules(frequentItemsets, transactions);

            // Calculate analytics
            const analytics = {
                totalTransactions: transactions.length,
                totalOrders: orders.length,
                uniqueProducts: new Set(orders.map(order => order.productId._id.toString())).size,
                frequentItemsetsCount: frequentItemsets.length,
                associationRulesCount: associationRules.length,
                averageRuleConfidence: associationRules.length > 0 
                    ? associationRules.reduce((sum, rule) => sum + rule.confidence, 0) / associationRules.length 
                    : 0,
                averageRuleLift: associationRules.length > 0 
                    ? associationRules.reduce((sum, rule) => sum + rule.lift, 0) / associationRules.length 
                    : 0,
                topRules: associationRules
                    .sort((a, b) => b.confidence - a.confidence)
                    .slice(0, 5)
            };

            res.status(200).json(analytics);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
}

export default AssociationRuleController; 