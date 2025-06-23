import Lighting from "../models/Lighting.js";

class LightingController {
    async index(req, res) {
        try {
            const lightingData = await Lighting.find({});
            res.status(200).json(lightingData);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    async store(req, res) {
        try {
            await Lighting.create({ ...req.body });
            res.status(200).json({ message: "Lighting option added" });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    async update(req, res) {
        try {
            const { id } = req.params;
            const { name } = req.body;

            const updatedLighting = await Lighting.findByIdAndUpdate(
                id,
                { name },
                { new: true }
            );

            if (!updatedLighting) {
                return res.status(404).json({ message: "Lighting option not found" });
            }

            res.status(200).json({ message: "Lighting option updated", lighting: updatedLighting });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.params;
            const deletedLighting = await Lighting.findByIdAndDelete(id);

            if (!deletedLighting) {
                return res.status(404).json({ message: "Lighting option not found" });
            }

            res.status(200).json({ message: "Lighting option deleted" });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
}

export default LightingController;
