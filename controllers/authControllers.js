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
      req.flash("error", "You Already have an account, please Login ")
      return res.redirect('/')
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
    res.redirect('/shop')

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
      req.flash("error", "Invalid email or password ")
      return res.redirect('/')
    }

    // 3️⃣ Compare password
    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
      req.flash("error", "Invalid email or password ")
      return res.redirect('/')
    }

    // 4️⃣ Generate JWT
    const token = generateToken(existingUser);

    // 5️⃣ Secure cookie
    res.cookie("token", token);

    // 6️⃣ Success response
    res.status(200).redirect("/shop");

  } catch (error) {
    dbgr(error.message);
    res.status(500).json({
      message: "Server error"
    });
  }
};


module.exports.logoutUser = (req, res) => {
  res.cookie("token", "")
  res.redirect('/')

}