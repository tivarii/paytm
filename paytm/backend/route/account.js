const express = require("express")
const zod = require("zod");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { Account, User } = require("../db"); const { authMiddleware } = require("../middleware");

router.get("/balance", authMiddleware, async (req, res) => {
    try {
        const acc = await Account.findOne({ userId: req.userId });
        res.status(200).json({
            balance: acc.balance,
        })
    } catch (e) {
        res.status(411).json({
            msg: "Some internal error"
        })
    }
});

const transfer = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    const to = req.body.to;
    const amount = req.body.amount;
    const account = Account.findOne({ userId: req.userId }).session(session);

    if (!account || account.balance < balance) {
        await session.abortTransaction();
        return res.status(400)
            .json({
                msg: "insufficient balance"
            })
    }

    const toAccount = await Account.findOne({ userId: to }).session(session);
    if (!toAccount) {
        await session.abortTransaction();
        return res.status(400)
            .json({
                msg: "Invalid Account"
            })
    }

    await Account.updateOne({ userId: req.userId }, { $inc: { balance: -amount } }).session(session);
    await Account.updateOne({ userId: to }, { $inc: { balance: amount } }).session(session);

    await session.commitTransaction();
    res.json({
        msg: "Transfered successful"
    })
}

router.post("/transfer",authMiddleware,transfer);




module.exports = { router };