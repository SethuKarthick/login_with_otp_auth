const express = require('express');
const router = express.Router();
const { signIn, verifyOtp, signUp} = require('../Controllers/userController');

router.route('/login')
    .post(signIn);
router.route('/signUp')
    .post(signUp)
router.route('/login/verify')
    .post(verifyOtp);



module.exports = router;