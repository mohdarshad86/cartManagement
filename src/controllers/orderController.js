const cartModel = require("../models/cartModel")
const userModel = require("../models/userModel")
const orderModel = require("../models/orderModel")
const { isValidObjectId } = require('mongoose')

const createOrder = async (req, res) => {
    try {
        let userId = req.params.userId;
        if (!isValidObjectId(userId)) return res.status(400).send({ status: false, message: "provide valid user id " });

        let data = req.body
        let { cartId } = data;

        if(cancellable){
            if(typeof cancellable == "string") {
            if(cancellable == "true" || cancellable == "false")  cancellable = JSON.parse(cancellable)
           else return res.status(400).send({ status: false, message: "chal chal apne bap ko mat sikha" });
       }
    }

        if (Object.keys(data).length == 0) return res.status(400).send({ status: false, message: "Please provide mandatory data to create order " });

        if (!cartId) return res.status(404).send({ status: false, message: "Please send CartId" });

        cartId = data.cartId = cartId.trim();
        if (cartId == "")
            return res.status(400).send({ status: false, message: "Please enter cartId value" });

        if (!isValidObjectId(cartId)) return res.status(400).send({ status: false, message: "provide valid cart id " });

        let cartData = await cartModel.findOne({ userId: userId, _id: cartId }).select({ _id: 0, userId: 1, items: 1, totalPrice: 1, totalItems: 1, totalQuantity: 1 }).lean();

        console.log(cartData)

        if (!cartData) return res.status(404).send({ status: false, message: "No cart Found for this user" });

        let userData = await userModel.findById(userId);
        if (!userData) return res.status(404).send({ status: false, message: "No user found for this id " });

        let quantity = 0;
        for (let i = 0; i < cartData.items.length; i++) {
            quantity += cartData.items[i].quantity // quantity = 5+0 = 5, 1 = 5+1 =6
        }

        let obj = {
            ...cartData,
            totalQuantity: quantity
        };

        let orderData = await orderModel.create(obj);
       
       await cartModel.findOneAndUpdate( {userId: userId },
             {$set: { items: [], totalPrice:0, totalItems: 0 }} , { new: true })

          
         return res.status(201).send({ status: false, data: orderData });

    }
    catch (err) { return res.status(500).send({ status: false, message: err.message }) }
};

const updateOrder = async (req, res) => {
    try {
        
    let userId = req.params.userId

    if (!isValidObjectId(userId)) return res.status(400).send({ status: false, message: "provide valid user id " });

    let data = req.body
    let { orderId, status } = data

    //pending, completed, cancelled
    if (Object.keys(data).length == 0) return res.status(400).send({ status: false, message: "Please provide mandatory data to create order " });

    if (!orderId) return res.status(400).send({ status: false, message: "orderId is mandatary" })

    orderId = data.orderId = orderId.trim();
    if (orderId == "")
        return res.status(400).send({ status: false, message: "Please enter orderId value" });

    if (!isValidObjectId(orderId)) return res.status(400).send({ status: false, message: "provide valid cart id " });

    if (!status) return res.status(400).send({ status: false, message: "Please provide status to update" });

    status = data.status = status.trim()
    if (status == "") return res.status(400).send({ status: false, message: "Please provide status value" });

    if (!["pending", "completed", "cancelled"].includes(status))
        return res.status(400).send({ status: false, message: "Status can only conatin pending, completed, cancelled" });

    let userExist = await userModel.findById(userId)

    if (!userExist) return res.status(400).send({ status: false, message: "User not exist " })

    let checkOrder = await orderModel.findById(orderId)

    if(!checkOrder) return 
    if (checkOrder.userId != userId) return res.status(400).send({ status: false, message: "user is not applicable for this order" })

    if (checkOrder.status == 'completed') return res.status(400).send({ status: false, message: "This order is already completed" })
 
    if (checkOrder.status == 'cancelled') return res.status(400).send({ status: false, message: "This order is already cancelled" })

    if (status == 'pending') return res.status(400).send({ status: false, message: "This order is already pending" })

    if (status == 'completed' ) {
        checkOrder.status = status,
        checkOrder.cancellable = false
    }
    if (status == 'cancelled') {
        if (checkOrder.cancellable == false)
            return res.status(400).send({ status: false, message: "This order is not cancellable" })
        checkOrder.status = status  
        checkOrder.cancellable = false
    }

    let updateOrders = await orderModel.findOneAndUpdate({ _id: orderId }, { status: checkOrder.status, cancellable: checkOrder.cancellable}, { new: true })

    return res.status(200).send({ status: false, data: updateOrders })
        
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

module.exports = { createOrder, updateOrder };