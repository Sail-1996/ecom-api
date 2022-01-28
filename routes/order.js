const Order = require("../models/Order")

const {
    verifyToken,
    verifyTokenAdmin,
    verifyTokenAndAuthorization
} = require("./verifyToken")

const router = require("express").Router()
//Create

router.post("/", verifyToken, async (req, res) => {
    const newOrder = new Order(req.body)

    try {
        const saveOrder = await newOrder.save()

        res.status(200).json(saveOrder)
    } catch (error) {
        res.status(500)
    }
})

//Update

router.patch("/:id", verifyTokenAdmin, async (req, res) => {
    try {
        const updateOrder = await Order.findByIdAndUpdate(
            req.params.id,
            {
                $set: res.body,
            }, {
            new: true
        }
        )
        res.status(200).json(updateOrder)
    } catch (error) {
        res.status(500)
    }
})

//Delete

router.delete("/:id", verifyTokenAdmin, async (req, res) => {
    try {
        await Order.findByIdAndDelete(req.params.id)
        res.status(200).json("Order has been deleted")
    } catch (error) {
        res.status(500)
    }
})

//Get User Orders

router.get("/finds/:userId", verifyTokenAndAuthorization, async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.params.userId })
        res.status(200).json(orders)
    } catch (error) {
        res.status(500)
    }
})

//Get All

router.get("/", verifyTokenAdmin, async (req, res) => {
    try {
        const orders = await Order.find()
        res.status(200).json(orders)
    } catch (error) {
        res.status(500)
    }
})

//Get Monthly Income

router.get("/income", verifyTokenAdmin, async (req, res) => {
    const date = new Date()
    const lastMonth = new Date(date.setMonth(date.getMonth() - 1))
    const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1))
    try {
        const income = await Order.aggregate([
            { $match: { createdAt: { $gte: previousMonth } } },
            {
                $project: {
                    month: { $month: "$createdAt" },
                    sales: "$amount"
                }
            },
            {
                $group: {
                    _id: "$month",
                    total: { $sum: "$sales" }
                }
            }
        ])
        res.status(200).json(income)
    } catch (error) {
        res.status(500)
    }
})

module.exports = router