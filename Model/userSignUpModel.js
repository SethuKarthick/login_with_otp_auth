const {Schema, model} = require('mongoose');



const userProfileSchema = Schema({
    number: {
        type: String, 
        required: true, 
    },
    email: {
        type: String, 
        required: true, 
        unique:true
    },
    name: {
        type: String, 
        required: true
    }, 
    otp:{
        type: String, 
        required: true
    }, 
    createdAt:{
        type: Date,
        default: Date.now,
        index:{
            expires: 300
        }
    } 
}, {timestamps: true });





module.exports.UserProfile =  model('UserProfile', userProfileSchema)