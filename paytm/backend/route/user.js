
const express=require("express");
const zod = require("zod");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { Account, User } =require("../db");
const { JWT_SECRET } =require( "../config");
const { authMiddleware } =require("../middleware");
const UserObject = zod.object(
    {
        username: zod.string().email(),
        firstName: zod.string(),
        lastName: zod.string(),
        password: zod.string().min(8)
    }
)

router.post("/signup", async (req, res) => {
    const body = req.body();
    const response = UserObject.safeParse(body);
    const respUser = async () => { User.findOne({ username: body.username }) }
    if (response.success && respUser) {
        const newUser = await User.create({
            firstName: body.firstName,
            lastName: bosy.lastName,
            username: body.username,
            password: body.password
        });
        Account.create({
            userId:newUser._id,
            balance:1+Math.random()*10000,

        })
        const token = jwt.sign({ id: newUser._id }, JWT_SECRET);
        res.status(200).json({
            msg: "User added succesfully",
            token: { token }
        })
    } else {
        res.status(411).json({
            message: "Email already taken / Incorrect inputs"
        })
    }
})


const signinBody = zod.object({
    username: zod.string().email,
    password: zod.string().min(8)
})

router.post("/signin", async (req, res) => {
    const data = await User.findOne({
        username: req.body.username,
        password: req.body.password
    });
    if (!(signinBody.safeParse(req.body)).success) {
        res.status(411).json({ msg: "Incorrect Input" });
    }
    if (data) {
        const token = jwt.sign({ id: data._id }, JWT_SECRET);
        res.status(200).json({
            token: token
        });
    } else {
        res.status(411).json({
            message: "Error while logging in"
        });
    }
})

router.put("/", authMiddleware, async (req, res) => {
    const updateBody = zod.object({
        password: zod.string().min(8).optional(),
        firstName: zod.string().optional,
        lastName: zod.string.optional(),
    });
    if (updateBody.safeParse(req.body).success) {
        try {
            const res = await User.update({ _id: req.userId }, body);
            res.status(200).json({
                msg: "Updated successfully"
            })
        } catch (e) {
            res.status(411).json({
                message: "Error while updating information"
            })
        }
    }
    else {
        res.status(411).json({
            message: "Invalid input"
        })
    }
})


router.get("/bulk", async (req, res) => {
    const d = req.query.filter || "";
    try {
        const user = await User.find({
            $or: [{
                firstName: {
                    "$regex": filter
                }
            }, {
                lastName: {
                    "$regex": filter
                }
            }]
        });
        res.status(200).json({
            data: user.map((u) => ({
                username: u.username,
                firstName: u.firstName,
                lastName: u.lastName,
                _id: u._id
            })),
        })
    }
    catch (e) {
        res.status(411).send("some error");
    }

})


module.exports = { "USerRoute":router };