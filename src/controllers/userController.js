const express = require("express");
const userModel = require("../models/userModel");

const createuser = async (req, res) => {
  try {
    let userData = req.body;

    const { fname, lname, email, profileImage, phone, password, address } =
      userData;

    const { shipping, billing } = address;

    let { street, city, pincode } = shipping;
    // let {street, city, pincode}=billing

    const isUserExist = await userModel.findOne({
      email: email,
      password: password,
    });

    if (isUserExist) {
      return res
        .status(400)
        .send({ status: false, message: "User already exist" });
    }

    const usercreated = await userModel.create(userData);
    return res.status(201).send({ status: true, data: usercreated });
  } catch (error) {
    console.log(error.message);
    return res.status(500).send({ status: false, message: error.message });
  }
};

module.exports = { createuser };
// - Create a user document from request body. Request body must contain image.
// - Upload image to S3 bucket and save it's public url in user document.
// - Save password in encrypted format. (use bcrypt)
// - __Response format__
//   - _**On success**_ - Return HTTP status 201. Also return the user document. The response should be a JSON object like [this](#successful-response-structure)
//   - _**On error**_ - Return a suitable error message with a valid HTTP status code. The response should be a JSON object like [this](#error-response-structure)
// ```yaml