export {};
const db = require("../database/mysql");
const utill = require("../utils/packages");
const sendError = (message: string) => {
  var error = {
    status: "ERROR",
    message,
  };

  return error;
};

const sendSuccess = (message: string) => {
  var success = {
    status: "SUCCESS",
    message,
  };

  return success;
};

const generateClientId = (length: number) => {
  var result = "";
  var characters = "123456789123456789123456789";
  var charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
};

const generateref = (length: number) => {
  var result = "";
  var characters =
    "123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz123456789123456789";
  var charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
};

const checkMail = async (req: any) => {
  return await db.Users.findOne({ where: { email: req.body.email } });
};

const apiData = (entry: any, message: string) => {
  const success = {
    status: "SUCCESS",
    data: entry,
    message,
  };

  return success;
};

const checkMobile = async (req: any) => {
  return await db.Users.findOne({
    where: { mobile_number: req.body.mobile },
  });
};

const checkPin = async (user_id: any, pin: string) => {
  let pinChecker = await db.TransactionPin.findOne({
    where: { user_id: user_id, pin },
  });

  return pinChecker;
};

const auditTransaction = async (body: any) => {
  await db.AuditLogs.create({
    sender_id: body.sender_id,
    reciever_id: body.reciever_id,
    reqbody: JSON.stringify(body.reqbody),
  });
};

const logTransaction = async (body: any) => {
  await db.Transactions.create({
    uuid: body.uuid,
    user_id: body.user_id,
    amount: body.amount,
    previous_balance: body.previous_balance,
    balance: body.balance,
    amount_deducted: body.amount_deducted,
    reference: body.reference,
    type: body.type,
    status: body.status,
    description: body.description,
  });
};

const checkSpecialChr = async (item: string) => {
  var format = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
  return format.test(item);
};

function hasWhiteSpace(s: string) {
  return /\s/g.test(s);
}

function checkNumber(n: string) {
  return /^\d+$/.test(n);
}

module.exports = {
  sendError,
  checkNumber,
  checkSpecialChr,
  checkPin,
  checkMail,
  checkMobile,
  generateClientId,
  auditTransaction,
  logTransaction,
  generateref,
  apiData,
  sendSuccess,
};
