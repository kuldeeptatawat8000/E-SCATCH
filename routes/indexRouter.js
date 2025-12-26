const express = require('express')
const router = express.Router();
const isLoginedIn = require("../middlewares/isLoginedIn")

router.get('/', (req, res) => {
    const error = req.flash("error")
    res.render('index', { error })
});

router.get('/shop', isLoginedIn, (req, res) => {
    res.render('shop')
})

module.exports = router