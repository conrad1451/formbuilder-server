const User = require("../models/Users");
const argon2 = require('argon2');
const validator = require('validator');

// CHQ: This includes
// 1. password hashing (via argon)
// 2. input validation for username, email, password
// 3. mongoose schema validation
// 4. secure password comparison during login
// 5. proper error handling


// Validation function
const validateUserInput = (username, email, password) => {
    const errors = [];
    
    // Validate username
    if (!username || username.length < 3) {
        errors.push("Username must be at least 3 characters long");
    }
    
    // Validate email
    if (!validator.isEmail(email)) {
        errors.push("Please provide a valid email address");
    }
    
    // Validate password
    if (!password || password.length < 8) {
        errors.push("Password must be at least 8 characters long");
    }
    if (!/\d/.test(password)) {
        errors.push("Password must contain at least one number");
    }
    if (!/[A-Z]/.test(password)) {
        errors.push("Password must contain at least one uppercase letter");
    }
    
    return errors;
};

const createUser = async (req, res) => {
    const { username, email, password } = req.body;
    
    try {
        // Validate input
        const validationErrors = validateUserInput(username, email, password);
        if (validationErrors.length > 0) {
            return res.status(400).json({ 
                message: "Validation failed", 
                errors: validationErrors 
            });
        }

        // Check if user exists
        const existingUser = await User.findOne({ 
            $or: [
                { username: username },
                { email: email }
            ]
        });
        
        if (existingUser) {
            return res.status(400).json({ 
                message: "User already exists with this username or email" 
            });
        }

        // Hash password with Argon2id
        const hashedPassword = await argon2.hash(password, {
            type: argon2.argon2id,
            memoryCost: 8192,  // 8MB
            timeCost: 8,       // 8 iterations
            parallelism: 1     // 1 thread
        });

        // Create new user with hashed password
        const user = new User({
            username,
            email,
            password: hashedPassword
        });

        await user.save();
        
        res.status(201).json({ 
            message: "User created successfully"
        });
        
    } catch (err) {
        console.error(err);
        res.status(500).json({ 
            message: 'Server error during user creation' 
        });
    }
};

const login = async (req, res) => {
    const { username, password } = req.body;
    
    try {
        const user = await User.findOne({ username });
        
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        // Verify password with Argon2id
        const passwordMatch = await argon2.verify(user.password, password);
        if (!passwordMatch) {
            return res.status(401).json({ message: "Invalid password" });
        }

        res.json({ message: 'Login successful' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    createUser,
    login
};