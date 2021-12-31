const bcrypt = require('bcrypt');
const _ = require('lodash');
const axios = require('axios');
const otpGenerator = require('otp-generator');

const { Otp } = require('../Model/otpModel');
const { UserProfile } = require('../Model/userSignUpModel');
let globalMobileNo = "";


module.exports.signIn = async(req, res) => {
    const user = await UserProfile.findOne({
        number: req.body.number
    });
    console.log(user)
    globalMobileNo = req.body.number;
    if (user){
        const OTP = otpGenerator.generate(6, {
            digits:true, alphabets:false, upperCaseAlphabets:false, specialChars:false 
        });
        const number = req.body.number;
        console.log(OTP)
        
        const salt = await bcrypt.genSalt(10);
        user.otp = await bcrypt.hash(OTP, salt);
        const result = await UserProfile.findOneAndUpdate({
            number: req.body.number
        }, {$set:user}, {new: true});
        console.log(result)
        const otp =  new Otp({number:number, otp:OTP});
        otp.otp = await bcrypt.hash(otp.otp, salt);
        const loginOtp = await otp.save();
        res.status(200).json(loginOtp)
    }
    else{
        next()
    }
}


module.exports.signUp = async(req, res) => {
    const number =  req.body.number;
    const email =  req.body.email;
    const name = req.body.name;
    const OTP = otpGenerator.generate(6, {
        digits:true, alphabets:false, upperCaseAlphabets:false, specialChars:false 
    });
    console.log(OTP)
    
    const newProfileDetails = new UserProfile({number:number, email:email, name:name, otp:OTP});
    const salt = await bcrypt.genSalt(10);
    newProfileDetails.otp = await bcrypt.hash(newProfileDetails.otp, salt);
    try{
        const newUser = await newProfileDetails.save();
    }
    catch(err){
        console.log(err)
    }
    const otp =  new Otp({number:number, otp:OTP});
    otp.otp = await bcrypt.hash(otp.otp, salt);
    const signUpOtp = await otp.save();
    res.status(200).json(signUpOtp)
}

module.exports.verifyOtp = async(req, res) => {
    const otpHolder =  await Otp.find({
        number: req.body.number
    });
    console.log(otpHolder)
    if (otpHolder.length === 0) return res.status(400).send("You use an Expired OTP!");
    const rightOtpFind = otpHolder[otpHolder.length - 1];
    console.log(rightOtpFind)
    const validUser = await bcrypt.compare(req.body.otp, rightOtpFind.otp);

    if (rightOtpFind.number === req.body.number && validUser) {
        const user = new Otp(_.pick(req.body, ["number", "otp"]));
        const token = user.generateJWT();
        const result = await user.save();
        const OTPDelete = await Otp.deleteMany({
            number: rightOtpFind.number
        });
        return res.status(200).send({
            message: "User Registration Successful!",
            token: token,
            data: result
        });
    } else {
        return res.status(400).send("Your OTP was wrong!")
    }
}
