const express = require("express")
const Router = express.Router();

Router.get("/", (req, res) => {
    res.send("hyy")
})

module.exports = Router