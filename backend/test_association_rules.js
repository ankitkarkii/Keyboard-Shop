import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Order from './src/models/Orders.js';
import Product from './src/models/Product.js';

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/your_database');

// Sample data for testing Association Rule Mining
const sampleOrders = [
    // User 1 purchases
    { orderedBy: 'user1', productId: 'product1', quantity: 1, price: 100 },
    { orderedBy: 'user1', productId: 'product2', quantity: 1, price: 150 },
    { orderedBy: 'user1', productId: 'product3', quantity: 1, price: 200 },
    
    // User 2 purchases
    { orderedBy: 'user2', productId: 'product1', quantity: 1, price: 100 },
    { orderedBy: 'user2', productId: 'product4', quantity: 1, price: 120 },
    { orderedBy: 'user2', productId: 'product5', quantity: 1, price: 180 },
    
    // User 3 purchases
    { orderedBy: 'user3', productId: 'product2', quantity: 1, price: 150 },
    { orderedBy: 'user3', productId: 'product3', quantity: 1, price: 200 },
    { orderedBy: 'user3', productId: 'product6', quantity: 1, price: 90 },
    
    // User 4 purchases
    { orderedBy: 'user4', productId: 'product1', quantity: 1, price: 100 },
    { orderedBy: 'user4', productId: 'product2', quantity: 1, price: 150 },
    { orderedBy: 'user4', productId: 'product7', quantity: 1, price: 250 },
    
    // User 5 purchases
    { orderedBy: 'user5', productId: 'product3', quantity: 1, price: 200 },
    { orderedBy: 'user5', productId: 'product4', quantity: 1, price: 120 },
    { orderedBy: 'user5', productId: 'product8', quantity: 1, price: 300 },
    
    // User 6 purchases
    { orderedBy: 'user6', productId: 'product1', quantity: 1, price: 100 },
    { orderedBy: 'user6', productId: 'product3', quantity: 1, price: 200 },
    { orderedBy: 'user6', productId: 'product9', quantity: 1, price: 160 },
    
    // User 7 purchases
    { orderedBy: 'user7', productId: 'product2', quantity: 1, price: 150 },
    { orderedBy: 'user7', productId: 'product4', quantity: 1, price: 120 },
    { orderedBy: 'user7', productId: 'product10', quantity: 1, price: 140 },
    
    // User 8 purchases
    { orderedBy: 'user8', productId: 'product1', quantity: 1, price: 100 },
    { orderedBy: 'user8', productId: 'product5', quantity: 1, price: 180 },
    { orderedBy: 'user8', productId: 'product11', quantity: 1, price: 220 },
];

// Sample products
const sampleProducts = [
    { _id: 'product1', name: 'Gaming Keyboard', categoryId: 'cat1', new_price: 100, quantity: 50 },
    { _id: 'product2', name: 'Gaming Mouse', categoryId: 'cat2', new_price: 150, quantity: 40 },
    { _id: 'product3', name: 'Gaming Headset', categoryId: 'cat3', new_price: 200, quantity: 30 },
    { _id: 'product4', name: 'Mouse Pad', categoryId: 'cat4', new_price: 120, quantity: 60 },
    { _id: 'product5', name: 'Webcam', categoryId: 'cat5', new_price: 180, quantity: 25 },
    { _id: 'product6', name: 'Microphone', categoryId: 'cat6', new_price: 90, quantity: 35 },
    { _id: 'product7', name: 'Monitor', categoryId: 'cat7', new_price: 250, quantity: 20 },
    { _id: 'product8', name: 'Graphics Card', categoryId: 'cat8', new_price: 300, quantity: 15 },
    { _id: 'product9', name: 'RAM', categoryId: 'cat9', new_price: 160, quantity: 45 },
    { _id: 'product10', name: 'SSD', categoryId: 'cat10', new_price: 140, quantity: 55 },
    { _id: 'product11', name: 'Power Supply', categoryId: 'cat11', new_price: 220, quantity: 30 },
];

async function insertSampleData() {
    try {
        console.log('Inserting sample products...');
        for (const product of sampleProducts) {
            await Product.findOneAndUpdate(
                { _id: product._id },
                product,
                { upsert: true, new: true }
            );
        }
        
        console.log('Inserting sample orders...');
        for (const order of sampleOrders) {
            await Order.findOneAndUpdate(
                { 
                    orderedBy: order.orderedBy, 
                    productId: order.productId 
                },
                order,
                { upsert: true, new: true }
            );
        }
        
        console.log('Sample data inserted successfully!');
    } catch (error) {
        console.error('Error inserting sample data:', error);
    }
}

async function testAssociationRules() {
    try {
        console.log('\n=== Testing Association Rule Mining ===\n');
        
        // Import the AssociationRuleController
        const AssociationRuleController = await import('./src/controller/AssociationRuleController.js');
        const arController = new AssociationRuleController.default();
        
        // Test 1: Get transactions
        console.log('1. Testing transaction extraction...');
        const mockReq1 = {};
        const mockRes1 = {
            status: (code) => ({
                json: (data) => {
                    if (code === 200) {
                        console.log(`   Total transactions: ${data.totalTransactions}`);
                        console.log(`   Total orders: ${data.totalOrders}`);
                    }
                }
            })
        };
        await arController.getTransactions(mockReq1, mockRes1);
        
        // Test 2: Generate frequent itemsets
        console.log('\n2. Testing frequent itemsets generation...');
        const mockReq2 = { query: { minSupport: 0.1 } };
        const mockRes2 = {
            status: (code) => ({
                json: (data) => {
                    if (code === 200) {
                        console.log(`   Frequent itemsets found: ${data.frequentItemsets.length}`);
                        data.frequentItemsets.forEach((itemset, index) => {
                            console.log(`   Itemset ${index + 1}: [${itemset.items.join(', ')}] - Support: ${(itemset.support * 100).toFixed(1)}%`);
                        });
                    }
                }
            })
        };
        await arController.generateFrequentItemsets(mockReq2, mockRes2);
        
        // Test 3: Generate association rules
        console.log('\n3. Testing association rules generation...');
        const mockReq3 = { query: { minConfidence: 0.3, minLift: 1.0 } };
        const mockRes3 = {
            status: (code) => ({
                json: (data) => {
                    if (code === 200) {
                        console.log(`   Association rules found: ${data.totalRules}`);
                        data.associationRules.slice(0, 5).forEach((rule, index) => {
                            console.log(`   Rule ${index + 1}: ${rule.antecedentName} → ${rule.consequentName}`);
                            console.log(`     Confidence: ${(rule.confidence * 100).toFixed(1)}%, Lift: ${rule.lift.toFixed(2)}`);
                        });
                    }
                }
            })
        };
        await arController.generateAssociationRules(mockReq3, mockRes3);
        
        // Test 4: Get recommendations for a specific product
        console.log('\n4. Testing product recommendations...');
        const mockReq4 = { params: { productId: 'product1' }, query: { limit: 3 } };
        const mockRes4 = {
            status: (code) => ({
                json: (data) => {
                    if (code === 200) {
                        console.log(`   Recommendations for product1: ${data.recommendations.length} products`);
                        data.recommendations.forEach((product, index) => {
                            console.log(`   Recommendation ${index + 1}: ${product.name}`);
                        });
                    }
                }
            })
        };
        await arController.getRecommendations(mockReq4, mockRes4);
        
        // Test 5: Get analytics
        console.log('\n5. Testing analytics...');
        const mockReq5 = {};
        const mockRes5 = {
            status: (code) => ({
                json: (data) => {
                    if (code === 200) {
                        console.log(`   Analytics Summary:`);
                        console.log(`   - Total transactions: ${data.totalTransactions}`);
                        console.log(`   - Total orders: ${data.totalOrders}`);
                        console.log(`   - Unique products: ${data.uniqueProducts}`);
                        console.log(`   - Association rules: ${data.associationRulesCount}`);
                        console.log(`   - Average confidence: ${(data.averageRuleConfidence * 100).toFixed(1)}%`);
                        console.log(`   - Average lift: ${data.averageRuleLift.toFixed(2)}`);
                    }
                }
            })
        };
        await arController.getAnalytics(mockReq5, mockRes5);
        
        console.log('\n=== Association Rule Mining Test Completed ===\n');
        
    } catch (error) {
        console.error('Error testing association rules:', error);
    }
}

async function runTests() {
    try {
        await insertSampleData();
        await testAssociationRules();
        
        console.log('All tests completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Test failed:', error);
        process.exit(1);
    }
}

// Run the tests
runTests(); 