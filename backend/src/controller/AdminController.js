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
                    req.session.user = { id: admin._id, email: admin.email, role: 'admin' };
                    res.json({ status: "success", user: { id: admin._id, email: admin.email, role: 'admin' } });
                } else {
                    res.json({ status: "error", message: "Password Incorrect" });
                }
            } else {
                res.json({ status: "error", message: "Admin not found" });
            }
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
}

export default AdminController;