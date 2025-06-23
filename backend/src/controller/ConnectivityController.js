import Connectivity from "../models/Connectivity.js";

class ConnectivityController {
    async index(req, res) {
        try {
            const connectivityData = await Connectivity.find({});
            res.status(200).json(connectivityData);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    async store(req, res) {
        try {
            await Connectivity.create({ ...req.body });
            res.status(200).json({ message: "Connectivity option added" });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    async update(req, res) {
        try {
            const { id } = req.params;
            const { name } = req.body;

            const updatedConnectivity = await Connectivity.findByIdAndUpdate(
                id,
                { name },
                { new: true }
            );

            if (!updatedConnectivity) {
                return res.status(404).json({ message: "Connectivity option not found" });
            }

            res.status(200).json({ message: "Connectivity option updated", connectivity: updatedConnectivity });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.params;
            const deletedConnectivity = await Connectivity.findByIdAndDelete(id);

            if (!deletedConnectivity) {
                return res.status(404).json({ message: "Connectivity option not found" });
            }

            res.status(200).json({ message: "Connectivity option deleted" });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
}

export default ConnectivityController;
