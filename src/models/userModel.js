const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({

    fname: {
        type: string,
        required: true,
        trim: true
    },
    lname: {
        type: string,
        required: true,
        trim: true
    },
    email: {
        type: string,
        required: true,
        unique: true,
        trim: true
    },
    profileImage: {
        type: string,
        required: true,
        trim: true
    },
    phone: {
        type: string,
        required: true,
        unique: true
    },
    password: {
        type: string,
        required: true,
        trim: true,
        min: 8,
        max: 15
    }, // encrypted password
    address: {
        shipping: {
            street: {
                type: string,
                required: true,
                trim: true
            },
            city: {
                type: string,
                required: true,
                trim: true
            },
            pincode: {
                type: number,
                required: true,
                trim: true
            }
        },
        billing: {
            street: {
                type: string,
                required: true,
                trim: true
            },
            city: {
                type: string,
                required: true,
                trim: true
            },
            pincode: {
                type: number,
                required: true,
                trim: true
            }
        }
    }},{timestamps: true})

module.exports = mongoose.model('user', userSchema)