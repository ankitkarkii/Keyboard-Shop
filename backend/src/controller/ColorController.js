import Color from "../models/Color.js";

class ColorController {
    async index(req, res) {
        try {
            const colorData = await Color.find({});
            res.status(200).json(colorData);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    async store(req, res) {
        try {
            await Color.create({ ...req.body });
            res.status(200).json({ message: "Color option added" });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    async update(req, res) {
        try {
            const { id } = req.params;
            const { name } = req.body;

            const updatedColor = await Color.findByIdAndUpdate(
                id,
                { name },
                { new: true }
            );

            if (!updatedColor) {
                return res.status(404).json({ message: "Color option not found" });
            }

            res.status(200).json({ message: "Color option updated", color: updatedColor });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.params;
            const deletedColor = await Color.findByIdAndDelete(id);

            if (!deletedColor) {
                return res.status(404).json({ message: "Color option not found" });
            }

            res.status(200).json({ message: "Color option deleted" });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
}

export default ColorController;
