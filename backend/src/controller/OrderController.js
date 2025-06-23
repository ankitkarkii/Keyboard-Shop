import Order from "../models/Orders.js";

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
            await Order.create({ ...req.body });
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
            const deletedOrder = await Order.findByIdAndDelete(id);
            if (!deletedOrder) {
                return res.status(404).json({ message: "Order not found" });
            }
            res.status(200).json({ success: true, message: "Order deleted successfully" });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
}

export default OrderController;