import User from "../models/User.js";

class UserController {
    async index(req, res) {
        try {
            const userData = await User.find({});
            res.status(200).json(userData);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    async store(req, res) {
        try {
            await User.create({ ...req.body });
            res.status(200).json({ success: true });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    async show(req, res) {
        try {
            let id = req.params.id;
            const userData = await User.findById(id);
            res.status(200).json(userData);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    async update(req, res) {
        try {
            let id = req.params.id;

            // Correctly update using the static method of the model
            await User.findByIdAndUpdate(id, { ...req.body }, { new: true });
            res.status(200).json({ success: true });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    async destroy(req, res) {
        try {
            let id = req.params.id;
            await User.findByIdAndDelete(id);
            res.status(200).json({ message: "User Deleted Successfully" });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    async searchByEmail(req, res) {
        try {
            const { email, password } = req.body;
            console.log(`Login attempt for email: ${email}`);
            let user = await User.findOne({ email: email });
            if (!user) {
                console.log('User not found in users collection, checking admins...');
                // Check admins collection if not found in users
                const Admin = await import("../models/Admin.js");
                user = await Admin.default.findOne({ email: email });
            } else {
                console.log('User found in users collection');
            }
    
            if (user) {
                if (user.password === password) {
                    console.log('Password match successful');
                    req.session.user = { id: user._id, email: user.email };
                    res.json({ status: "success", user: { id: user._id, email: user.email } });
                } else {
                    console.log('Password incorrect');
                    res.json({ status: "error", message: "Password Incorrect" });
                }
            } else {
                console.log('User not found in both users and admins collections');
                res.json({ status: "error", message: "User not found" });
            }
        } catch (err) {
            console.error('Error during login:', err);
            res.status(500).json({ message: err.message });
        }
    }
    
}

export default UserController;
