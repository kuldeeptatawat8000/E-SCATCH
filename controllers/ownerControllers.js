const ownerModel = require("../models/owner-model");
const bcrypt = require("bcrypt");
const dbgr = require("debug")("development:owner");
const generateToken = require('../utils/jwtTokenGenerate')
module.exports.ownerCreate = async (req, res) => {

    // 🔐 Only allow in development
    if (process.env.NODE_ENV !== "development") {
        return res.status(403).json({
            message: "Owner creation not allowed in production"
        });
    }

    try {
        const { fullname, email, password } = req.body;

        // 1️⃣ Validation
        if (!fullname || !email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        // 2️⃣ Allow only ONE owner
        const owners = await ownerModel.find();
        if (owners.length > 0) {
            return res.status(403).json({
                message: "Owner already exists"
            });
        }

        // 3️⃣ Hash password
        const hashPassword = await bcrypt.hash(password, 10);

        // 4️⃣ Create owner
        const owner = await ownerModel.create({
            fullname,
            email,
            password: hashPassword
        });

        // JWT Token 
        const token = await generateToken(owner);
        res.cookie("token", token)
        // 5️⃣ Safe response
        res.status(201).json({
            message: "Owner created successfully",
            owner: {
                id: owner._id,
                fullname: owner.fullname,
                email: owner.email
            },
            token
        });

    } catch (error) {
        dbgr(error.message);
        res.status(500).json({
            message: "Server error"
        });
    }
}