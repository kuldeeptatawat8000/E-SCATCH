const express = require("express");
const router = express.Router();
const { ownerCreate } = require('../controllers/ownerControllers')

router.post("/create", ownerCreate);

router.get("/", (req, res) => {
  res.send("hyy");
});

module.exports = router;
