import BodyMaterial from "../models/BodyMaterial.js";

class BodyMaterialController {
    async index(req, res) {
        try {
            const bodyMaterialData = await BodyMaterial.find({});
            res.status(200).json(bodyMaterialData);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    async store(req, res) {
        try {
            await BodyMaterial.create({ ...req.body });
            res.status(200).json({ message: "Body material option added" });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    async update(req, res) {
        try {
            const { id } = req.params;
            const { name } = req.body;

            const updatedBodyMaterial = await BodyMaterial.findByIdAndUpdate(
                id,
                { name },
                { new: true }
            );

            if (!updatedBodyMaterial) {
                return res.status(404).json({ message: "Body material option not found" });
            }

            res.status(200).json({ message: "Body material option updated", bodyMaterial: updatedBodyMaterial });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.params;
            const deletedBodyMaterial = await BodyMaterial.findByIdAndDelete(id);

            if (!deletedBodyMaterial) {
                return res.status(404).json({ message: "Body material option not found" });
            }

            res.status(200).json({ message: "Body material option deleted" });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
}

export default BodyMaterialController;
