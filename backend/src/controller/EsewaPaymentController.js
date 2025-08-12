import axios from 'axios';
import crypto from 'crypto';
import Order from '../models/Orders.js';

class EsewaPaymentController {
    constructor() {
        // eSewa test configuration
        this.testConfig = {
            merchantId: 'EPAYTEST',
            secretKey: '8gBm/:&EnhH.1/q',
            baseUrl: 'https://uat.esewa.com.np',
            successUrl: 'http://localhost:5173/payment/success',
            failureUrl: 'http://localhost:5173/payment/failure'
        };
    }

    // Generate signature for eSewa
    generateSignature(message) {
        return crypto
            .createHmac('sha256', this.testConfig.secretKey)
            .update(message)
            .digest('base64');
    }

    // Initiate eSewa payment
    async initiatePayment(req, res) {
        try {
            const { orderId, amount } = req.body;

            // Find the order
            const order = await Order.findById(orderId);
            if (!order) {
                return res.status(404).json({ message: 'Order not found' });
            }

            // Generate transaction UUID
            const transactionUUID = `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

            // Prepare eSewa payment data
            const paymentData = {
                amt: amount,
                psc: 0,
                pdc: 0,
                txAmt: 0,
                tAmt: amount,
                pid: transactionUUID,
                scd: this.testConfig.merchantId,
                su: this.testConfig.successUrl,
                fu: this.testConfig.failureUrl
            };

            // For test mode, return the payment URL
            const paymentUrl = `${this.testConfig.baseUrl}/epay/main`;
            
            res.json({
                success: true,
                paymentUrl,
                paymentData,
                transactionUUID
            });

        } catch (error) {
            console.error('Error initiating eSewa payment:', error);
            res.status(500).json({ message: 'Failed to initiate payment' });
        }
    }

    // Verify eSewa payment
    async verifyPayment(req, res) {
        try {
            const { oid, amt, refId } = req.query;

            // In test mode, we'll simulate verification
            const isValid = this.verifyTestPayment(oid, amt, refId);

            if (isValid) {
                // Update order status only after successful verification
                const order = await Order.findById(oid);
                if (order && order.paymentStatus !== 'completed') {
                    order.paymentStatus = 'completed';
                    order.paymentMethod = 'esewa';
                    order.transactionId = refId;
                    order.paymentCompletedAt = new Date();
                    order.status = 'processing';
                    await order.save();
                }

                res.json({
                    success: true,
                    message: 'Payment verified successfully',
                    transactionId: refId,
                    paymentStatus: 'completed'
                });
            } else {
                // Handle failed payment
                const order = await Order.findById(oid);
                if (order) {
                    order.paymentStatus = 'failed';
                    await order.save();
                }
                
                res.json({
                    success: false,
                    message: 'Payment verification failed',
                    paymentStatus: 'failed'
                });
            }

        } catch (error) {
            console.error('Error verifying eSewa payment:', error);
            res.status(500).json({ message: 'Payment verification failed' });
        }
    }

    // Test payment verification (for development)
    verifyTestPayment(oid, amt, refId) {
        // In test mode, accept any valid-looking reference
        return refId && refId.startsWith('000') && amt > 0;
    }

    // Handle payment success
    async handleSuccess(req, res) {
        try {
            const { oid, amt, refId } = req.query;

            // Verify the payment
            const verification = await this.verifyPaymentInternal(oid, amt, refId);

            if (verification.success) {
                res.json({
                    success: true,
                    message: 'Payment successful',
                    orderId: oid,
                    transactionId: refId
                });
            } else {
                res.json({
                    success: false,
                    message: 'Payment verification failed'
                });
            }

        } catch (error) {
            console.error('Error handling payment success:', error);
            res.status(500).json({ message: 'Payment processing failed' });
        }
    }

    // Internal verification method
    async verifyPaymentInternal(oid, amt, refId) {
        try {
            // Test verification URL
            const verificationUrl = `${this.testConfig.baseUrl}/epay/transrec`;
            
            const verificationData = {
                amt: amt,
                rid: refId,
                pid: oid,
                scd: this.testConfig.merchantId
            };

            // In test mode, simulate successful verification
            return {
                success: true,
                data: {
                    transactionId: refId,
                    amount: amt,
                    status: 'COMPLETE'
                }
            };

        } catch (error) {
            console.error('Error in internal verification:', error);
            return { success: false };
        }
    }

    // Get payment status
    async getPaymentStatus(req, res) {
        try {
            const { orderId } = req.params;
            
            const order = await Order.findById(orderId);
            if (!order) {
                return res.status(404).json({ message: 'Order not found' });
            }

            res.json({
                orderId: order._id,
                paymentStatus: order.paymentStatus || 'pending',
                paymentMethod: order.paymentMethod,
                transactionId: order.transactionId
            });

        } catch (error) {
            console.error('Error getting payment status:', error);
            res.status(500).json({ message: 'Failed to get payment status' });
        }
    }
}

export default new EsewaPaymentController();
