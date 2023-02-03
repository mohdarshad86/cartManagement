const productModel = require('../models/productModel')

const createProduct = async (req, res) => {
    try {
        const productData = req.body

        let { title, description, price, currencyId, currencyFormat, style, availableSizes, installments, } = productData

        //===========  title  ===========

        if (!title) { return res.status(400).send({ status: false, message: "please provide title" }) }

        if (typeof title != "string") {
            return res.status(400).send({ status: false, message: "title should be in string" });
        }

        title = productData.title = title.trim();

        if (title == "")
            return res.status(400).send({ status: false, message: "Please Enter title value" });

        // regex  ==================================== remains

        let titleExist = await productModel.findOne({ title: title })
        if (titleExist) return res.status(400).send({ status: true, message: "This title is already exist in" })


        // ==============   description validation ======

        if (!description) { return res.status(400).send({ status: false, message: "please provide description" }) }

        if (typeof description != "string") {
            return res
                .status(400)
                .send({ status: false, message: "description should be in string" });
        }

        description = productData.description = description.trim();

        if (description == "")
            return res
                .status(400)
                .send({ status: false, message: "Please Enter description value" });

        //=============================== price validation =============

        if (!price) return res.status(400).send({ status: false, message: "please provide price" })

        price = productData.price = price.trim()
        if (price == "") return res.status(400).send({ status: false, message: "please provide price value" })

        price = productData.price = Number(price)

        if (isNaN(price) || typeof price != "number") return res.status(400).send({ status: false, message: "price should be in number" });

        // =============== regex  valid number ======================

        price = productData.price = price.toFixed(2)

        //200 
        // ============================== currencyId: {string, mandatory, INR} =====

        if (!currencyId) return res.status(400).send({ status: false, message: "please provide currencyId" })

        if (typeof currencyId != "string") {
            return res
                .status(400)
                .send({ status: false, message: "currencyId should be in string" });
        }

        currencyId = productData.currencyId = currencyId.trim();

        if (currencyId == "")
            return res
                .status(400)
                .send({ status: false, message: "Please Enter currencyId value" });

        if (productData.currencyId != "INR") { return res.status(400).send({ status: false, message: "opps enter INR " }) }


        //==========================  currencyFormat {string, mandatory, Rupee symbol},


        if (!currencyFormat) { return res.status(400).send({ status: false, message: "please provide currencyFormat" }) }

        if (typeof currencyFormat != "string") {
            return res
                .status(400)
                .send({ status: false, message: "currencyFormat should be in string" });
        }

        currencyFormat = productData.currencyFormat = currencyFormat.trim();

        if (currencyFormat == "")
            return res
                .status(400)
                .send({ status: false, message: "Please Enter currencyFormat value" });

        if (productData.currencyFormat != "₹") { return res.status(400).send({ status: false, message: "Please enter ₹ " }) }

        //========================= productImage ========

        productImage = req.files

        if (!productImage) { return res.status(400).send({ status: false, message: "please provide productImage" }) }

        productData.productImage = req.image


        //=============================  style: {string},

        if (style) {

            if (typeof style != "string") {
                return res
                    .status(400)
                    .send({ status: false, message: "style should be in string" });
            }

            style = productData.style = style.trim();

            if (style == "")
                return res
                    .status(400)
                    .send({ status: false, message: "Please Enter style value" });
        }

        //=======================availableSizes: {array of string, at least one size, enum["S", "XS","M","X", "L","XXL", "XL"]}

        if (availableSizes) {

            // availableSizes = JSON.parse(availableSizes) DOUBT
            if (typeof availableSizes != "string") return res.status(400).send({ status: false, message: `Please Enter sizes in string` })


            let temp = []
            let size = availableSizes.split(",").map(x => x.trim())

            temp = size
            size.forEach((size) => {
                if (!(["S", "XS", "M", "XL", "XXL", "L"].includes(size))) {
                    return res.status(400).send({ status: false, message: `Please Enter sizes S, XS, M, XL, XXL, L ` })
                }
                productData.availableSizes = temp
            })
        }

        // ==== installments: {number}

        if (installments) {

            if (typeof installments != "string") {
                return res
                    .status(400)
                    .send({ status: false, message: "style should be in string" });
            }

            installments = productData.installments = installments.trim()

            if (installments == "") return res.status(400).send({ status: false, message: "Please Enter installments value" });

            installments = productData.installments = Number(installments)

            if (typeof installments != "number") return res.status(400).send({ status: false, message: "installments should be in number" });

            // what is use to (should we use regex )

        }

        let createProduct = await productModel.create(productData)
        return res.status(201).send({ status: false, data: createProduct })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

const getProduct = async (req, res) => {

    try {
        let data = req.query
        let { size, name, priceGreaterThan, priceLessThan } = data

        if (Object.values(data).length == undefined) {
            return res.status(400).send({ status: false, message: "query" });
        }

        let expectedQueries = ["size", "name", "priceGreaterThan", "priceLessThan",];
        let queries = Object.keys(data);
        let count = 0;
        for (let i = 0; i < queries.length; i++) {
            if (!expectedQueries.includes(queries[i])) count++;
        }
        if (count > 0)
            return res.status(400).send({ status: false, message: "queries can only have size, name, priceGreaterThan, priceLessThan" });

        let filter = { isDeleted: false, }

        console.log(data, req.query.length);

        if (name ) {

            if (typeof name != "string")
                return res.status(400).send({ status: false, message: "name string should be in string" });

            name = data.name = name.trim();

            if (name == "")
                return res.status(400).send({ status: false, message: "Please Enter name value" });

            filter.title = name
        }

        if (size ) {

            if (typeof availableSizes != "string") return res.status(400).send({ status: false, message: `Please Enter sizes in string` })

            let temp = []
            let size = availableSizes.split(",").map(x => x.trim())

            if (size.length == 0)
                return res.status(400).send({ status: false, message: "Please Enter name value" });

            temp = size
            size.forEach((size) => {
                if (!(["S", "XS", "M", "XL", "XXL", "L"].includes(size))) {
                    return res.status(400).send({ status: false, message: `Please Enter sizes S, XS, M, XL, XXL, L ` })
                }
                filter.availableSizes = temp
            })

            // filter.availableSizes = size
        }

        if (priceGreaterThan ) filter['price'] = { $gt: priceGreaterThan }

        if (priceLessThan ) filter['price'] = { ...filter['price'], $lt: priceLessThan }

        console.log(filter);

        let getProduct = await productModel.find(filter).sort({ price: 1 })

        if (getProduct.length == 0) return res.status(404).send({ status: false, message: "No Product for this Filter" })

        return res.status(200).send({ status: true, message: 'Success', data: getProduct })

    } catch (error) {
        return res.status(404).send({ status: false, message: error.message })
    }
}


module.exports = { createProduct, getProduct }