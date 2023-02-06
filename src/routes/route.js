const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const productController=require("../controllers/productController")
const cartController=require("../controllers/cartController")
const auth = require('../middlewares/auth')
const aws = require("../middlewares/awsLink");


//USER
router.post("/register", aws.awsLink, userController.register);
router.post("/login", userController.loginUser)
router.get('/user/:userId/profile', auth.authentication, userController.getUser)
router.put('/user/:userId/profile',aws.awsUpdate, auth.authentication, auth.authorization, userController.UpdateUser)

//PRODUCT
router.post("/products",aws.awsProduct, productController.createProduct);
router.get("/products", productController.getProduct);
router.get('/products/:productId', productController.getProductById)
router.put('/products/:productId',aws.awsUpdate, productController.updateProduct)
router.delete('/products/:productId',  productController.deleteProduct)

//Cart
router.post("/users/:userId/cart", cartController.createCart);
router.put("/users/:userId/cart", cartController.updateCart);



router.all('*/', function(req, res){
    return res.status(400).send({status:false, message:"Invalid Path"})
})

module.exports = router;
