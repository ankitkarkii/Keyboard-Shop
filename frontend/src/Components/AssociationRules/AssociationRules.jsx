import React, { useState, useEffect } from 'react';
import API from '../../API';

const AssociationRules = () => {
    const [analytics, setAnalytics] = useState(null);
    const [rules, setRules] = useState([]);
    const [frequentItemsets, setFrequentItemsets] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('analytics');

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        setLoading(true);
        try {
            const response = await API.get('/association-rules/analytics');
            setAnalytics(response.data);
        } catch (error) {
            console.error('Error fetching analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchRules = async () => {
        setLoading(true);
        try {
            const response = await API.get('/association-rules/rules?minConfidence=0.3&minLift=1.0');
            setRules(response.data.associationRules);
        } catch (error) {
            console.error('Error fetching rules:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchFrequentItemsets = async () => {
        setLoading(true);
        try {
            const response = await API.get('/association-rules/frequent-itemsets?minSupport=0.05');
            setFrequentItemsets(response.data.frequentItemsets);
        } catch (error) {
            console.error('Error fetching frequent itemsets:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        if (tab === 'rules' && rules.length === 0) {
            fetchRules();
        } else if (tab === 'itemsets' && frequentItemsets.length === 0) {
            fetchFrequentItemsets();
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">
                Association Rule Mining Analytics
            </h1>

            {/* Tab Navigation */}
            <div className="flex space-x-4 mb-6 border-b border-gray-200">
                <button
                    onClick={() => handleTabChange('analytics')}
                    className={`py-2 px-4 font-medium rounded-t-lg ${
                        activeTab === 'analytics'
                            ? 'text-blue-600 border-b-2 border-blue-600'
                            : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                    Analytics Overview
                </button>
                <button
                    onClick={() => handleTabChange('rules')}
                    className={`py-2 px-4 font-medium rounded-t-lg ${
                        activeTab === 'rules'
                            ? 'text-blue-600 border-b-2 border-blue-600'
                            : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                    Association Rules
                </button>
                <button
                    onClick={() => handleTabChange('itemsets')}
                    className={`py-2 px-4 font-medium rounded-t-lg ${
                        activeTab === 'itemsets'
                            ? 'text-blue-600 border-b-2 border-blue-600'
                            : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                    Frequent Itemsets
                </button>
            </div>

            {/* Analytics Tab */}
            {activeTab === 'analytics' && analytics && (
                <div className="space-y-6">
                    {/* Key Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h3 className="text-lg font-semibold text-gray-700">Total Transactions</h3>
                            <p className="text-3xl font-bold text-blue-600">{analytics.totalTransactions}</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h3 className="text-lg font-semibold text-gray-700">Total Orders</h3>
                            <p className="text-3xl font-bold text-green-600">{analytics.totalOrders}</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h3 className="text-lg font-semibold text-gray-700">Unique Products</h3>
                            <p className="text-3xl font-bold text-purple-600">{analytics.uniqueProducts}</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h3 className="text-lg font-semibold text-gray-700">Association Rules</h3>
                            <p className="text-3xl font-bold text-orange-600">{analytics.associationRulesCount}</p>
                        </div>
                    </div>

                    {/* Quality Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h3 className="text-lg font-semibold text-gray-700 mb-4">Rule Quality Metrics</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Average Confidence:</span>
                                    <span className="font-semibold">
                                        {(analytics.averageRuleConfidence * 100).toFixed(2)}%
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Average Lift:</span>
                                    <span className="font-semibold">
                                        {analytics.averageRuleLift.toFixed(2)}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Frequent Itemsets:</span>
                                    <span className="font-semibold">{analytics.frequentItemsetsCount}</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h3 className="text-lg font-semibold text-gray-700 mb-4">Top Association Rules</h3>
                            <div className="space-y-2">
                                {analytics.topRules.map((rule, index) => (
                                    <div key={index} className="text-sm">
                                        <div className="font-medium text-gray-800">
                                            {rule.antecedentName} → {rule.consequentName}
                                        </div>
                                        <div className="text-gray-600">
                                            Confidence: {(rule.confidence * 100).toFixed(1)}% | 
                                            Lift: {rule.lift.toFixed(2)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Association Rules Tab */}
            {activeTab === 'rules' && (
                <div className="bg-white rounded-lg shadow-md">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-800">
                            Association Rules ({rules.length} rules)
                        </h2>
                        <p className="text-gray-600 mt-2">
                            Rules showing product relationships based on purchase patterns
                        </p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Antecedent
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Consequent
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Support
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Confidence
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Lift
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {rules.map((rule, index) => (
                                    <tr key={index} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {rule.antecedentName}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {rule.consequentName}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {(rule.support * 100).toFixed(2)}%
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {(rule.confidence * 100).toFixed(1)}%
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {rule.lift.toFixed(2)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Frequent Itemsets Tab */}
            {activeTab === 'itemsets' && (
                <div className="bg-white rounded-lg shadow-md">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-800">
                            Frequent Itemsets ({frequentItemsets.length} itemsets)
                        </h2>
                        <p className="text-gray-600 mt-2">
                            Product combinations that appear frequently in transactions
                        </p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Items
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Support
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Count
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {frequentItemsets.map((itemset, index) => (
                                    <tr key={index} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 text-sm text-gray-900">
                                            <div className="flex flex-wrap gap-1">
                                                {itemset.items.map((item, itemIndex) => (
                                                    <span
                                                        key={itemIndex}
                                                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                                    >
                                                        {item}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {(itemset.support * 100).toFixed(2)}%
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {itemset.count}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AssociationRules; 