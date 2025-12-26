const userModel = require("../models/user-model");
const bcrypt = require("bcrypt");
const dbgr = require("debug")("development:mongoose");
const generateToken = require("../utils/jwtTokenGenerate");

module.exports.registerUser = async (req, res) => {
    try {
        const { fullname, email, password } = req.body;

        // 1️⃣ Validation
        if (!fullname || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // 2️⃣ Email already exists
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "Email already registered" });
        }

        // 3️⃣ Hash password
        const hashPassword = await bcrypt.hash(password, 10);

        // 4️⃣ Create user
        const user = await userModel.create({
            fullname,
            email,
            password: hashPassword,
        });

        // JWT token
        const token = await generateToken(user);
        res.cookie('token', token)

        // 5️⃣ Response (hide password)
        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user._id,
                fullname: user.fullname,
                email: user.email,
            },
            token,
        });

    } catch (error) {
        dbgr(error.message);
        res.status(500).json({ message: "Server error" });
    }
}


module.exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1️⃣ Validation
    if (!email || !password) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    // 2️⃣ Check user exists
    const existingUser = await userModel.findOne({ email });
    if (!existingUser) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    // 3️⃣ Compare password
    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    // 4️⃣ Generate JWT
    const token = generateToken(existingUser);

    // 5️⃣ Secure cookie
    res.cookie("token", token);

    // 6️⃣ Success response
    res.status(200).json({
      message: "User logged in successfully"
    });

  } catch (error) {
    dbgr(error.message);
    res.status(500).json({
      message: "Server error"
    });
  }
};
