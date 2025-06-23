import Admin from "../models/Admin.js";

class AdminController {
    async index(req, res) {
        try {
            const adminData = await Admin.find({});
            res.status(200).json(adminData);
        } catch (err) {
            res.status(500).json({ message: err.message })
        }
    }

    async store(req, res) {
        try {
            await Admin.create({ ...req.body });
            res.status(200).json({ message: "Admin Added" });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    async searchByEmail(req, res) {
        try {
            const { email, password } = req.body;
            const admin = await Admin.findOne({ email: email });

            if (admin) {
                if (admin.password === password) {
                    res.json("success");
                } else {
                    res.json("Password Incorrect");
                }
            } else {
                res.json("Admin not found");
            }
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
}

export default AdminController;