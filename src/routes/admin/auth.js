const express = require('express')
const router = express.Router()
const { requireSignin } = require('../../common-middleware')
const { signup, signin } = require('../../controller/admin/auth')
const { validateSignupRequest, isRequestValidated, validateSigninRequest } = require('../../validators/auth')


router.post('/admin/signin',validateSignupRequest, isRequestValidated , signin)
router.post('/admin/signup',validateSigninRequest, isRequestValidated, signup)
router.post('/admin/singout', requireSignin, signout)


module.exports = router










