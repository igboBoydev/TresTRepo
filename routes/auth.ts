export {};
const express = require("express");
require("../config/passport");
const router = express.Router();
const { personalSignature } = require("../middleware/personalSignature");
const passport = require("passport");
require("dotenv").config();
const jwtMiddleWare = passport.authenticate("jwt", { session: false });

const authenticatedCtrl = require("../controllers/AuthenticatedCtrl");

router.get(
  "/get-profile",
  [jwtMiddleWare, personalSignature],
  authenticatedCtrl.getProfile
);

router.post(
  "/create-pin",
  [jwtMiddleWare, personalSignature],
  authenticatedCtrl.createTransactionPin
);

router.post(
  "/send-money",
  [jwtMiddleWare, personalSignature],
  authenticatedCtrl.sendMoney
);

router.get(
  "/all-transactions",
  [jwtMiddleWare, personalSignature],
  authenticatedCtrl.allTransactions
);

module.exports = router;
