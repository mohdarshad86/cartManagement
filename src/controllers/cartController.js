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


        let productExist = await productModel.findById(productId)

        if (!productExist) return res.status(404).send({ status: false, message: "Product not Exist" });

        if (productExist.isDeleted == true) return res.status(404).send({ status: false, message: "Product Deleted" });

        // let cartExist=await cartModel.findById(cartId)


        if (!cartId) {
            cartData.items = []
            cartData.userId = userId

            let obj = {
                productId: productId,
                quantity: 1
            }
            cartData.items.push(obj)
            console.log(cartData);
            let createCart = await cartModel.create(cartData)

            return res.send({ status: true, data: createCart })
        }

        let cartExist = await cartModel.findById(cartId)

        if (!cartExist)
            return res.send({ status: false, message: "Cart not find" })

        for (let i = 0; i < cartExist.items.length; i++) {
            if (productId == cartExist.items[i].productId) {
                cartExist.items[i].quantity += 1;
            }
        }

        let obj = {
            productId: productId,
            quantity: 1
        }

        let cartAdded = await cartModel.findByIdAndUpdate(cartId, { $push: { items: obj } }, { new: true })
        return res.send({ status: true, data: cartAdded })

    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }

};

module.exports = { createCart }