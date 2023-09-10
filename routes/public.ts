const expresss = require("express");
const router = expresss.Router();
const { personalSignature } = require("../middleware/personalSignature");
require("dotenv").config();

const Register = require("../controllers/RegisterCtrl");
const LoginCtrl = require("../controllers/LoginCtrl");

// Authentication
router.post("/register", [personalSignature], Register.register);
router.post("/login", [personalSignature], LoginCtrl.Login);

module.exports = router;
