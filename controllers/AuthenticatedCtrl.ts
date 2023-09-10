import { Request, Response, NextFunction } from "express";
const utill = require("../utils/packages");
const { Op } = require("sequelize");
const db = require("../database/mysql");
const { paginate } = require("paginate-info");

module.exports = {
  getProfile: async (req: any, res: Response, next: NextFunction) => {
    const user = {
      uuid: req.user.uuid,
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      customer_id: req.user.customer_id,
      username: req.user.username,
      organisation: req.user.organisation,
      email: req.user.email,
      country: req.user.country,
      mobile_number: req.user.mobile_number,
      company_name: req.user.company_name,
      profileDoc: req.user.profileDoc,
      verification_status: req.user.verification_status,
      company_address: req.user.company_address,
      role_id: req.user.role_id,
      is_Admin: req.user.is_Admin,
      admin_type: req.user.admin_type,
      team_status: req.user.team_id,
      companyFounded: req.user.companyFounded,
      type: req.user.type,
      ratePerKg: req.user.ratePerkg,
      login_status: req.user.reg_status,
      locked: req.user.locked,
      activated: req.user.activated,
    };
    return res
      .status(200)
      .json(utill.helpers.apiData(user, "Profile api response"));
  },

  createTransactionPin: async (
    req: any,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    const pinSchema = utill.Joi.object()
      .keys({
        pin: utill.Joi.string().required(),
      })
      .unknown();

    const validate = pinSchema.validate(req.body);

    if (validate.error != null) {
      const errorMessage = validate.error.details
        .map((i: any) => i.message)
        .join(".");
      return res.status(400).json(utill.helpers.sendError(errorMessage));
    }

    const { pin } = req.body;
    let checkForChr = await utill.helpers.checkSpecialChr(pin);

    if (checkForChr) {
      return res
        .status(400)
        .json(
          utill.helpers.sendError(
            "Transaction pin cannot contain special characters"
          )
        );
    }

    await db.TransactionPin.create({
      user_id: req.user.id,
      pin: pin,
      is_active: 1,
    });

    return res
      .status(200)
      .json(utill.helpers.sendSuccess("Transaction pin created successfully"));
  },

  sendMoney: async (
    req: any,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    const TransferSchema = utill.Joi.object()
      .keys({
        amount: utill.Joi.number().required(),
        destination_wallet_id: utill.Joi.string().required(),
        pin: utill.Joi.string().required(),
        otp: utill.Joi.string().required(),
      })
      .unknown();

    const validate = TransferSchema.validate(req.body);

    if (validate.error != null) {
      const errorMessage = validate.error.details
        .map((i: any) => i.message)
        .join(".");
      return res.status(400).json(utill.helpers.sendError(errorMessage));
    }

    const { pin, amount, destination_wallet_id, otp } = req.body;

    let pinChecker = await utill.helpers.checkPin(req.user.id, pin);

    if (!pinChecker) {
      return res.status(400).json(utill.helpers.sendError("Invalid pin"));
    }

    let recieverwalletChecker = await db.Wallets.findOne({
      where: { unique_id: destination_wallet_id },
    });

    if (!recieverwalletChecker) {
      return res
        .status(400)
        .json(utill.helpers.sendError("User with wallet does not exist"));
    }

    let senderWallet = await db.Wallets.findOne({
      where: { user_id: req.user.id },
    });

    if (senderWallet.unique_id === destination_wallet_id) {
      return res
        .status(400)
        .json(utill.helpers.sendError("Error, invalid transaction"));
    }

    let balance = parseFloat(senderWallet.balance) - parseFloat(amount);

    if (balance < 0) {
      return res
        .status(400)
        .json(
          utill.helpers.sendError("Insufficient balance to make transaction")
        );
    }
    const ref = utill.helpers.generateref(12);

    // log sender transaction
    const data = {
      uuid: utill.uuid(),
      user_id: req.user.id,
      amount: parseFloat(amount),
      previous_balance: parseFloat(senderWallet.balance),
      balance: parseFloat(senderWallet.balance) - parseFloat(amount),
      amount_deducted: parseFloat(amount),
      reference: ref,
      type: "debit",
      status: "success",
      description: `sent the sum of ${amount} to wallet with unique id ${senderWallet.unique_id}`,
    };
    await utill.helpers.logTransaction(data);

    // log reciever transaction
    const data2 = {
      uuid: utill.uuid(),
      user_id: recieverwalletChecker.user_id,
      amount: amount,
      previous_balance: parseFloat(recieverwalletChecker.balance),
      balance: parseFloat(recieverwalletChecker.balance) + parseFloat(amount),
      amount_deducted: null,
      reference: ref,
      type: "credit",
      status: "success",
      description: `recieved the sum of ${amount} from wallet with unique id ${destination_wallet_id}`,
    };
    await utill.helpers.logTransaction(data2);

    // transaction audit
    utill.helpers.auditTransaction({
      sender_id: req.user.id,
      reciever_id: recieverwalletChecker.user_id,
      reqbody: req.body,
    });

    recieverwalletChecker.balance =
      parseFloat(recieverwalletChecker.balance) + parseFloat(amount);
    senderWallet.balance = balance;
    await senderWallet.save();
    await recieverwalletChecker.save();

    return res
      .status(200)
      .json(utill.helpers.sendSuccess("Transaction successful"));
  },

  allTransactions: async (
    req: any,
    res: any,
    next: NextFunction
  ): Promise<Response> => {
    const { pageNum } = req.query;

    if (!pageNum || isNaN(pageNum)) {
      return res
        .status(400)
        .json(utill.helpers.sendError("Kindly add a valid page number"));
    }

    var currentPage = parseInt(pageNum) ? parseInt(pageNum) : 1;

    var page = currentPage - 1;
    var pageSize = 25;
    const offset = page * pageSize;
    const limit = pageSize;

    let allTransactions = await db.Transactions.findAndCountAll({
      offset: offset,
      limit: limit,
      order: [["id", "DESC"]],
    });

    var next_page = currentPage + 1;
    var prev_page = currentPage - 1;
    var nextP = `api/v1/Kieriantech/auth/all-transactions?pageNum=` + next_page;
    var prevP = `api/v1/Kieriantech/auth/all-transactions?pageNum=` + prev_page;

    const meta = paginate(
      currentPage,
      allTransactions.count,
      allTransactions.rows,
      pageSize
    );

    return res.status(200).json({
      status: "SUCCESS",
      data: allTransactions,
      per_page: pageSize,
      current_page: currentPage,
      last_page: meta.pageCount, //transactions.count,
      first_page_url: `api/v1/Kieriantech/auth/all-transactions?pageNum=1`,
      last_page_url:
        `api/v1/Kieriantech/auth/all-transactions?pageNum=` + meta.pageCount, //transactions.count,
      next_page_url: nextP,
      prev_page_url: prevP,
      path: `api/v1/Kieriantech/auth/all-transactions?pageNum=`,
      from: 1,
      to: meta.pageCount, //transactions.count,
    });
  },
};
