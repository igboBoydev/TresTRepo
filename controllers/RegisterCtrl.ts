require("dotenv").config();
import { Request, Response, NextFunction } from "express";
const utill = require("../utils/packages");
const db = require("../database/mysql");

// interface TypedRequestBody<T> extends Express.Request {
//   body: T;
// }

// export interface TypedRequestBody<T extends Query, U> extends Express.Request {
//   body: U;
//   query: T;
// }

// interface TypedResponse<ResBody> extends Express.Response {
//   json: Send<ResBody, this>;
// }

module.exports = {
  register: async (req: Request, res: Response, next: NextFunction) => {
    const schema = utill.Joi.object()
      .keys({
        email: utill.Joi.string().required(),
        mobile: utill.Joi.string().required(),
        password: utill.Joi.string().required(),
      })
      .unknown();

    const validate = schema.validate(req.body);

    if (validate.error != null) {
      const errorMessage = validate.error.details
        .map((i: any) => i.message)
        .join(".");
      return res.status(400).json(utill.helpers.sendError(errorMessage));
    }

    let checkMail = await utill.helpers.checkMail(req);
    let checkMobile = await utill.helpers.checkMobile(req);

    if (checkMail) {
      return res
        .status(400)
        .json(utill.helpers.sendError("User with email already exists"));
    }

    if (checkMobile) {
      return res
        .status(400)
        .json(
          utill.helpers.sendError("User with mobile number already exists")
        );
    }

    const { email, password, mobile } = req.body;

    if (!email.includes("@")) {
      return res
        .status(400)
        .json(utill.helpers.sendError("Kindly enter a valid email address"));
    }

    if (/[a-zA-Z]/.test(mobile)) {
      return res
        .status(400)
        .json(utill.helpers.sendError("Kindly enter a valid mobile number"));
    }

    var customer_id = utill.helpers.generateClientId(10);

    const createUser = await db.Users.create({
      customer_id,
      uuid: utill.uuid(),
      verification_status: "success",
      locked: 0,
      activated: 1,
      mobile_number: mobile,
      status: "Active",
      password: utill.bcrypt.hashSync(password),
      email,
    });

    if (createUser) {
      await db.Wallets.create({
        unique_id: utill.uuid(),
        type: "wallet",
        user_id: createUser.id,
        balance: 0.0,
      });
      return res
        .status(200)
        .json(utill.helpers.sendSuccess("Registration successful"));
    } else {
      return res.status(400).json(utill.helpers.sendError("Error occured"));
    }
  },
};
