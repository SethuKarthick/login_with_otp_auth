const {Schema, model} = require('mongoose');
const jwt = require('jsonwebtoken');

const otpSchema = Schema({
    number:{
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
})


otpSchema.methods.generateJWT =  function(){
    const token = jwt.sign({
        _id : this._id, 
        number: this.number
    }, process.env.JWT_SECRET_KEY,  {expiresIn : 300})
    return token
}

module.exports.Otp = model("Otp", otpSchema)