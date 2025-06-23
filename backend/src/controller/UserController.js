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
            const user = await User.findOne({ email: email });
    
            if (user) {
                if (user.password === password) {
                    // req.session.userId = user._id;
                    res.json("success");
                } else {
                    res.json("Password Incorrect");
                }
            } else {
                res.json("User not found");
            }
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
    
}

export default UserController;
