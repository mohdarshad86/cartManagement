const { isValidObjectId } = require("mongoose");
const cartModel = require("../models/cartModel");
const userModel = require("../models/userModel");
const productModel = require("../models/productModel");

/*

## Cart APIs (authentication required as authorization header - bearer token)
### POST /users/:userId/cart (Add to cart)
- Create a cart for the user if it does not exist.
 Else add product(s) in cart.
- Get cart id in request body.
- Get productId in request body.
- Make sure that cart exist.
- Add a product(s) for a user in the cart.
- Make sure the userId in params and in JWT token match.
- Make sure the user exist
- Make sure the product(s) are valid and not deleted.
- Get product(s) details in response body.
*/

const createCart = async function (req, res) {

    try {
        const userId = req.params.userId
        const cartData = req.body;

        let { cartId, productId } = cartData;

        if (Object.keys(cartData).length == 0) {
            return res.status(400).send({ status: false, message: "can't create data with empty body" })
        }

        if (cartId) {
            if (!isValidObjectId(cartId)) return res.status(400).send({ status: false, message: " Valid CartID!" })
            var cartExist = await cartModel.findOne({ _id: cartId, userId: userId })
            if (!cartExist) return res.status(404).send({ status: false, message: "No cart found" })
        }

        if (!productId) return res.status(400).send({ status: false, message: "Product id is mandatory " })
        if (!isValidObjectId(productId)) return res.status(400).send({ status: false, message: " Invalid product ID!" })
        let product = await productModel.findOne({ _id: productId, isDeleted: false })
        if (!product) return res.status(400).send({ status: false, message: "Product doesn't exists!" })

        if (cartData.quantity == 0) return res.status(400).send({ status: false, message: "You can't add 0 quantity of any item in your cart" })
        if (!cartData.quantity) {
            cartData.quantity = 1
        }

        let quantity = cartData.quantity
        let totalPrice = product.price * quantity

        if (cartId) {

            let productPresent = cartExist.items
            for (let i = 0; i < productPresent.length; i++) {
                if (productPresent[i].productId == productId) {
                    let index = i
                    let updatedproduct = productPresent[i]
                    updatedproduct.quantity += quantity
                    // At position index, add 1 elements, remove 1:
                    productPresent.splice(index, 1, updatedproduct)

                    price = cartExist.totalPrice + (product.price * quantity)

                    totalItem = productPresent.length

                    let cart = await cartModel.findOneAndUpdate({ _id: cartId }, { items: productPresent, totalPrice: price, totalItems: totalItem }, { new: true })

                    return res.status(200).send({ status: true, data: cart })
                }
            }

            let newItem = {
                productId: productId,
                quantity: quantity
            }
            price = cartExist.totalPrice + (product.price * quantity)

            cartExist.items.push(newItem)
            totalItem = cartExist.items.length

            let cart = await cartModel.findByIdAndUpdate({ _id: cartId }, { items: productPresent, totalPrice: price, totalItems: totalItem }, { new: true })
            return res.status(200).send({ status: true, data: cart })
        }

       let items = {
            productId: productId,
            quantity: quantity
        }

        let cartAlreadyExist = await cartModel.findOne({userId: userId})
        console.log(cartAlreadyExist)
        if(cartAlreadyExist){
            return res.status(400).send({status: false, message: "Cart already exist for this user, Please send cart id in request"})
        }
        let cart = await cartModel.create({ userId: userId, items: items, totalPrice: totalPrice, totalItems: 1 })

        return res.status(201).send({ status: true, data: cart })
    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

module.exports = { createCart }