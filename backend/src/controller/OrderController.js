import Order from "../models/Orders.js";
import Product from "../models/Product.js";

class OrderController {
    async index(req, res) {
        try {
            const orderData = await Order.find({});
            res.status(200).json(orderData);
        } catch (err) {
            res.status(500).json({ message: err.message })
        }
    }

    // Get orders for logged-in user
    async userOrders(req, res) {
        try {
            const userId = req.session.user ? req.session.user.id : null;
            if (!userId) {
                return res.status(401).json({ message: "Unauthorized. Please log in." });
            }
            const orders = await Order.find({ orderedBy: userId });
            res.status(200).json(orders);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    async store(req, res) {
        try {
            const userId = req.session.user ? req.session.user.id : null;
            if (!userId) {
                return res.status(401).json({ message: "Unauthorized. Please log in." });
            }
            
            const orderData = {
                ...req.body,
                orderedBy: userId,
                paymentStatus: 'pending',
                status: 'pending'
            };
            
            const order = await Order.create(orderData);
            res.status(200).json({ 
                success: true, 
                orderId: order._id,
                paymentStatus: order.paymentStatus 
            });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    // Initiate payment for an order
    async initiatePayment(req, res) {
        try {
            const { orderId } = req.params;
            const userId = req.session.user ? req.session.user.id : null;
            
            if (!userId) {
                return res.status(401).json({ message: "Unauthorized. Please log in." });
            }

            const order = await Order.findOne({ _id: orderId, orderedBy: userId });
            if (!order) {
                return res.status(404).json({ message: "Order not found" });
            }

            if (order.paymentStatus !== 'pending') {
                return res.status(400).json({ message: "Payment already initiated or completed" });
            }

            order.paymentStatus = 'initiated';
            order.paymentInitiatedAt = new Date();
            await order.save();

            res.status(200).json({ 
                success: true, 
                orderId: order._id,
                paymentStatus: order.paymentStatus 
            });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    // Complete payment for an order
    async completePayment(req, res) {
        try {
            const { orderId } = req.params;
            const { transactionId, amount } = req.body;
            const userId = req.session.user ? req.session.user.id : null;
            
            if (!userId) {
                return res.status(401).json({ message: "Unauthorized. Please log in." });
            }

            const order = await Order.findOne({ _id: orderId, orderedBy: userId });
            if (!order) {
                return res.status(404).json({ message: "Order not found" });
            }

            if (order.paymentStatus === 'completed') {
                return res.status(400).json({ message: "Payment already completed" });
            }

            order.paymentStatus = 'completed';
            order.transactionId = transactionId;
            order.paymentCompletedAt = new Date();
            order.status = 'processing';
            await order.save();

            res.status(200).json({ 
                success: true, 
                orderId: order._id,
                paymentStatus: order.paymentStatus,
                transactionId: order.transactionId 
            });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    // Update Order by ID
    async update(req, res) {
    const { id } = req.params;
    try {
        const updatedOrder = await Order.findByIdAndUpdate(
            id,
            { ...req.body },
            { new: true }
        );
        if (!updatedOrder) {
            return res.status(404).json({ message: "Order not found" });
        }
        res.status(200).json(updatedOrder);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}


    // Delete Order by ID
    async delete(req, res) {
        const { id } = req.params;
        try {
            const orderToDelete = await Order.findById(id);
            if (!orderToDelete) {
                return res.status(404).json({ message: "Order not found" });
            }

            // Add back the quantity to the product
            const product = await Product.findById(orderToDelete.productId);
            if (product) {
                product.quantity += orderToDelete.quantity;
                await product.save();
            }

            await Order.findByIdAndDelete(id);

            res.status(200).json({ success: true, message: "Order deleted successfully" });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
}

export default OrderController;
