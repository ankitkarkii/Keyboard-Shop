import User from "../models/User.js";
import Admin from "../models/Admin.js";
import { hashPassword, comparePassword } from "../utils/auth.js";

class UserController {
    async index(req, res) {
        try {
            const userData = await User.find({}).select('-password');
            res.status(200).json({
                success: true,
                data: userData
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                message: 'Failed to fetch users',
                error: err.message
            });
        }
    }

    async store(req, res) {
        try {
            const { email, password, name } = req.body;

            // Check if user already exists
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: 'User with this email already exists'
                });
            }

            // Hash password
            const hashedPassword = await hashPassword(password);

            // Create user
            const user = await User.create({
                email,
                password: hashedPassword,
                name
            });

            res.status(201).json({
                success: true,
                message: 'User created successfully',
                data: {
                    id: user._id,
                    email: user.email,
                    name: user.name
                }
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                message: 'Failed to create user',
                error: err.message
            });
        }
    }

    async show(req, res) {
        try {
            const id = req.params.id;
            const userData = await User.findById(id).select('-password');
            
            if (!userData) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            res.status(200).json({
                success: true,
                data: userData
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                message: 'Failed to fetch user',
                error: err.message
            });
        }
    }

    async update(req, res) {
        try {
            const id = req.params.id;
            const { password, ...updateData } = req.body;

            // If password is being updated, hash it
            if (password) {
                updateData.password = await hashPassword(password);
            }

            const updatedUser = await User.findByIdAndUpdate(
                id, 
                updateData, 
                { new: true }
            ).select('-password');

            if (!updatedUser) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            res.status(200).json({
                success: true,
                message: 'User updated successfully',
                data: updatedUser
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                message: 'Failed to update user',
                error: err.message
            });
        }
    }

    async destroy(req, res) {
        try {
            const id = req.params.id;
            const deletedUser = await User.findByIdAndDelete(id);
            
            if (!deletedUser) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            res.status(200).json({
                success: true,
                message: 'User deleted successfully'
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                message: 'Failed to delete user',
                error: err.message
            });
        }
    }

    async searchByEmail(req, res) {
        try {
            const { email, password } = req.body;

            // Find user in users collection
            let user = await User.findOne({ email });
            
            // If not found, check admins collection
            if (!user) {
                user = await Admin.findOne({ email });
            }

            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid email or password'
                });
            }

            // Verify password
            const isPasswordValid = await comparePassword(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid email or password'
                });
            }

            // Create session
            req.session.user = {
                id: user._id,
                email: user.email,
                name: user.name
            };

            res.status(200).json({
                success: true,
                message: 'Login successful',
                data: {
                    id: user._id,
                    email: user.email,
                    name: user.name
                }
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                message: 'Login failed',
                error: err.message
            });
        }
    }
}

export default UserController;
