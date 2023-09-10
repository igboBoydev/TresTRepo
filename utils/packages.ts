// libraries/packages
exports.express = require("express");
exports.session = require("express-session");
exports.helpers = require("../config/helpers");
exports.cors = require("cors");
exports.cookieParser = require("cookie-parser");
exports.bodyParser = require("body-parser");
exports.passport = require("passport");
exports.passportJWT = require("passport-jwt");
exports.Joi = require("joi");
exports.cryptoJS = require("crypto-js");
exports.helmet = require("helmet");
exports.rateLimit = require("express-rate-limit");
exports.compression = require("compression");
exports.moment = require("moment");
exports.jwt = require("jsonwebtoken");
exports.bcrypt = require("bcryptjs");
exports.jwt_decode = require("jwt-decode");
exports.crypto = require("crypto");
exports.axios = require("axios");
exports.sequelize = require("sequelize");
exports.uuid = require("node-uuid");

// routes
exports.authRoute = require("../routes/auth");
exports.publicRoute = require("../routes/public");

// Controller directories

//  Mailers
