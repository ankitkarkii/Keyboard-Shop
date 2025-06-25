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

    async store(req, res) {
        try {
            const userId = req.session.user ? req.session.user.id : null;
            if (!userId) {
                return res.status(401).json({ message: "Unauthorized. Please log in." });
            }
            await Order.create({ ...req.body, orderedBy: userId });
            res.status(200).json({ success: true });
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
