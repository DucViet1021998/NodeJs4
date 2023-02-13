const express = require('express')
const app = express()
const router = express.Router()
const userModel = require('./Models/UserModel')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
const bcrypt = require('bcrypt')


dotenv.config()

const cors = require('cors')
app.use(cors())
app.use(express.json())



router.post('/login', async (req, res) => {
    try {
        const username = req.body.username
        const user = await userModel.findOne({ username: username })
        if (!!user) {
            const passwordLogin = req.body.password
            const passwordDB = user.password
            const equalCompare = await bcrypt.compare(passwordLogin, passwordDB)
            if (equalCompare === true) {
                const token = jwt.sign(user.id, process.env.ACCESS_TOKEN_SECRET)
                res.send(token)
            } else {
                res.send('Not Match password!')
            }
        }
        else {
            res.status(404).send('Not Found Your Account')
        }


    } catch (error) {
        console.log(error);
        res.send('Error!')
    }
})





router.post('/register', async (req, res) => {
    try {

        const username = req.body.username
        const user = await userModel.findOne({ username: username })
        if (!!user) {
            res.status(401).send('Da Co Tai Khoan')

        }
        else {
            const hashedPass = await bcrypt.hash(req.body.password, 10)
            await userModel.create({
                username: req.body.username,
                email: req.body.email,
                gender: req.body.gender,
                password: hashedPass
            })
            res.status(200).send('Success')
        }

    } catch (error) {
        console.log(error);
        res.send("Error!")
    }
})


module.exports = router