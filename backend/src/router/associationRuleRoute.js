import express from 'express';
import AssociationRuleController from '../controller/AssociationRuleController.js';

const associationRuleRouter = express.Router();
const arInstance = new AssociationRuleController();

// Get all transactions (for debugging/analysis)
associationRuleRouter.get('/transactions', arInstance.getTransactions);

// Generate frequent itemsets using Apriori algorithm
associationRuleRouter.get('/frequent-itemsets', arInstance.generateFrequentItemsets);

// Generate association rules from frequent itemsets
associationRuleRouter.get('/rules', arInstance.generateAssociationRules);

// Get recommendations based on association rules for a specific product
associationRuleRouter.get('/recommendations/:productId', arInstance.getRecommendations);

// Get analytics about association rules
associationRuleRouter.get('/analytics', arInstance.getAnalytics);

export default associationRuleRouter; 