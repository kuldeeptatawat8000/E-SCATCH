const express = require("express");
const router = express.Router();
const { ownerCreate } = require('../controllers/ownerControllers')

router.post("/create", ownerCreate);

router.get("/admin", (req, res) => {
  res.render('createProducts');
});

module.exports = router;
