const express = require("express");
const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const aws = require("aws-sdk");
const validation=require('../validations/validation')

aws.config.update({
  accessKeyId: "AKIAY3L35MCRZNIRGT6N",
  secretAccessKey: "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",
  region: "ap-south-1",
});

let uploadFile = async (file) => {
  return new Promise(function (resolve, reject) {
    let s3 = new aws.S3({ apiVersion: "2006-03-01" });

    var uploadParams = {
      ACL: "public-read", //Access Control Locator
      Bucket: "classroom-training-bucket",
      Key: "abc/" + file.originalname,
      Body: file.buffer,
    };

    s3.upload(uploadParams, function (err, data) {
      if (err) {
        return reject({ error: err });
      }
      console.log(data);
      console.log("file uploaded succesfully");
      return resolve(data.Location);
    });
  });
};

const register = async (req, res) => {
  try {
    let userData = req.body;

    let { fname, lname, email, profileImage, phone, password } =
      userData;

    // const { shipping, billing } = address;

    // let { street, city, pincode } = shipping;
    // // let {street, city, pincode}=billing

    // const isUserExist = await userModel.findOne({
    //   email: email,
    //   password: password,
    // });

    // if (isUserExist) {
    //   return res
    //     .status(400)
    //     .send({ status: false, message: "User already exist" });
    // }

    //AWS
    profileImage = req.files;

    if (Object.keys(profileImage).length == 0) {
      return res
        .status(400)
        .send({ status: false, message: "Please upload Profile Image" });
    }

    let image = await uploadFile(profileImage[0]);

    userData.profileImage = image;

    const usercreated = await userModel.create(userData);
    return res.status(201).send({ status: true, data: usercreated });
  } catch (error) {
    console.log(error.message);
    return res.status(500).send({ status: false, message: error.message });
  }
};

const loginUser = async (req, res) => {
  let data = req.body;
  if (Object.keys(data) == 0)
    return res.status(400).send({ status: false, message: "Please send data" });
  let isUserExist = await userModel.findOne({
    email: email,
    password: password,
  });
  if (!isUserExist)
    return res.status(404).send({ status: false, message: "No user found " });
  let token = jwt.sign(
    { userId: isUserExist.userId, exp: Date.now() / 1000 + 86400 },
    "project5"
  );
  res
    .status(200)
    .send({ status: true, message: "User login successfull", data: token });
};

module.exports = { loginUser, register };
