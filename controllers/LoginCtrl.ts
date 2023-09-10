const utill = require("../utils/packages");
import { Request, Response, NextFunction } from "express";
const { Op } = require("sequelize");
const db = require("../database/mysql");

const signTokens = (user: any, token: string) => {
  var token: string = utill.jwt.sign(
    {
      id: user.id,
      email: user.email,
      fullname: user.fullname,
      conpany_name: user.conpany_name,
      phone_number: user.phone_number,
      otp: user.otp,
    },
    process.env.SECRET,
    {
      expiresIn: 1800,
    }
  );
  var decoded = utill.jwt_decode(token);
  db.Oauth.create(decoded);
  return token;
};

module.exports = {
  Login: async (req: Request, res: Response, next: NextFunction) => {
    const loginSchema = utill.Joi.object()
      .keys({
        email: utill.Joi.string().required(),
        password: utill.Joi.string().required(),
      })
      .unknown();

    const validate = loginSchema.validate(req.body);

    if (validate.error != null) {
      const errorMessage = validate.error.details
        .map((i: any) => i.message)
        .join(".");
      return res.status(400).json(utill.helpers.sendError(errorMessage));
    }

    const { email, password } = req.body;

    let user = await db.Users.findOne({ where: { email } });

    if (!user) {
      return res
        .status(400)
        .json(utill.helpers.sendError("Account does not exist"));
    }

    if (utill.bcrypt.compareSync(password, user.password)) {
      if (user.locked === 1) {
        return res.status(400).json({
          status: "ERROR",
          code: "01",
          message: "Your account has been locked, kindly contact support",
        });
      }

      if (user.status !== "Active") {
        return res.status(400).json({
          status: "ERROR",
          code: "01",
          message:
            "Your account has been deactivated, kindly contact super admin",
        });
      }

      if (user.verification_status === "declined") {
        return res.status(400).json({
          status: "ERROR",
          code: "01",
          message: "Your account has been declined, kindly contact support",
        });
      }

      user.login_count = parseInt(user.login_count) + 1;
      user.last_login_time = utill.moment().format("YYYY-MM-DD HH:mm:ss");
      await user.save();

      let random = utill.uuid();

      const token = signTokens(user, random);

      return res
        .status(200)
        .json(utill.helpers.apiData(token, "Login successful"));
    }

    return res
      .status(400)
      .json(utill.helpers.sendError("Incorrect email or password"));
  },
};
