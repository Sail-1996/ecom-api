const Product = require("../models/Product")
const {
    verifyToken,
    verifyTokenAndAuthorization,
    verifyTokenAdmin,
} = require("./verifyToken")

const router = require("express").Router()

//Create
router.post("/", verifyTokenAdmin, async (req, res) => {
    const newProduct = new Product(req.body)

    try {
        const saveProduct = await newProduct.save();
        res.status(200).json(saveProduct)
    } catch (error) {
        res.status(500)
    }
})

//Update
router.patch("/:id", verifyTokenAdmin, async (req, res) => {
    try {
        const updateProduct = await Product.findByIdAndUpdate(
            req.params.id,
            {
                $set: res.body,
            },
            { new: true }
        )
        res.status(200).json(updateProduct)
    } catch (error) {
        res.status(500)
    }

})

//Delete
router.delete("/:id", verifyTokenAdmin, async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id)
        res.status(200).json("Product has been deleted")
    } catch (error) {
        res.status(500)
    }
})

//Get Product

router.get("/find/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
        res.status(200).json(product)
    } catch (error) {
        res.status(500)
    }
})

//Get All Products

router.get("/", async (req, res) => {
    const qNew = res.query.new
    const qCategory = req.query.qCategory
    try {
        let products
        if (qNwe) {
            products = await Product.find().sort({ createdAt: -1 }).limit(1)
        } else if (qCategory) {
            products = await Product.find({
                categories: {
                    $in: [qCategory]
                }
            })
        } else {
            products = await Product.find()
        }
        res.status(200).json(products)
    } catch (error) {
        res.status(500)
    }
})

module.exports = router