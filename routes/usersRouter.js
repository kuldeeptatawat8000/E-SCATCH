const express = require("express");
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authControllers')

router.get("/", (req, res) => {
    res.send("hyy");
});

router.post("/register", registerUser);
router.post('/login',loginUser)

module.exports = router;
