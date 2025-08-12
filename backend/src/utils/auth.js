import bcrypt from 'bcryptjs';

export const hashPassword = async (password) => {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
};

export const comparePassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
};

export const generateToken = (userId) => {
    // In a real app, use JWT or similar
    return `token_${userId}_${Date.now()}`;
};

export const authenticateToken = (req, res, next) => {
    // For now, allow all requests (basic implementation)
    // In production, implement proper JWT token validation
    if (req.session && req.session.user) {
        req.user = req.session.user;
        return next();
    }
    
    // Allow some routes without authentication for testing
    if (req.path === '/user' && req.method === 'POST') {
        return next(); // Allow user registration
    }
    if (req.path === '/user/search' && req.method === 'POST') {
        return next(); // Allow user login
    }
    
    return res.status(401).json({
        success: false,
        message: 'Access token required'
    });
};
