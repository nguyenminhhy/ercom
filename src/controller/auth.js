const User = require('../models/user')
const jwt  = require('jsonwebtoken')


exports.signup = (req,res) => {

    User.findOne({email: req.body.email})
    .exec((error, user) => {
        if(user) return res.status(400).json({
            message: 'User already register'
        })
        const { 
            firstName,
            lastName,
            email,
            password
        } = req.body

        const _user = new User({
            firstName, 
            lastName, 
            email, 
            password,
            username: Math.random().toString()
        })

        _user.save((error,data)=>{
            if(error){
                return res.status(400).json({
                    message: 'something wemt wrong'
                })
            }

            if(data){
                return res.status(201).json({
                    message: 'User created successfully..'
                })
            }
        })

    })
}

exports.signin = (req,res) => {
    User.findOne({email: req.body.email})
    .exec((error, user) =>{
        if(error) return res.status(400).json(error)
        if(user){
            if(user.authenticate(req.body.password)){
                const token = jwt.sign({_id: user._id, role: user.role}, process.env.JWT_SECRET, {expiresIn: '1h'})
                const { _id ,firstName, lastName, email, role, fullName } = user
                return res.status(200).json({
                    token,
                    user: {
                        _id, firstName, lastName, email, role, fullName
                    }
                })
            } else {
                return res.status(400).json({
                    message: 'Invalid Password'
                })
            }
        } else {
            return res.status(400).json({message: 'something went wrong'})
        }
    })
}

// nháp
exports.getAllUser = async (req,res,next) => {
    try {
        const users = await User.find()
        return res.json({users})
    } catch (error) {
        next(error)        
    }
}

exports.getUserById = async (req,res,next) =>{
    try {
        const user = await User.findById(req.params.id)
        if(user === null) throw new APIError({message : "user not exist"})
        return res.json({user})
    } catch (err) {
        next(err)
    }
}

