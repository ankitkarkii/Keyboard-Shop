import PollingRate from "../models/PollingRate.js";

class PollingRateController {
    async index(req, res) {
        try {
            const pollingRateData = await PollingRate.find({});
            res.status(200).json(pollingRateData);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    async store(req, res) {
        try {
            await PollingRate.create({ ...req.body });
            res.status(200).json({ message: "Polling rate option added" });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    async update(req, res) {
        try {
            const { id } = req.params;
            const { name } = req.body;

            const updatedPollingRate = await PollingRate.findByIdAndUpdate(
                id,
                { name },
                { new: true }
            );

            if (!updatedPollingRate) {
                return res.status(404).json({ message: "Polling rate option not found" });
            }

            res.status(200).json({ message: "Polling rate option updated", pollingRate: updatedPollingRate });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.params;
            const deletedPollingRate = await PollingRate.findByIdAndDelete(id);

            if (!deletedPollingRate) {
                return res.status(404).json({ message: "Polling rate option not found" });
            }

            res.status(200).json({ message: "Polling rate option deleted" });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
}

export default PollingRateController;
