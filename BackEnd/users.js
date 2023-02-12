const express = require('express')
const app = express()
const router = express.Router()


const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/UserLogin');

const { Schema } = mongoose;

app.use(express.json())

const userSchema = new Schema({
    name: mongoose.Schema.Types.String,
    password: mongoose.Schema.Types.Number

});

const userModel = mongoose.model('user', userSchema);

router.post('/register', async (req, res) => {
    try {
        // if (!req.body.name || !req.body.age || !req.body.address || !req.body.gender) {
        //     return res.send('Nhập hết tên tuổi số nhà giới tính đi thằng ngu! ')
        // }

        const user = await userModel.create({
            name: req.body.name,
            age: req.body.age,
            address: req.body.address,
            gender: req.body.gender,
            album: req.body.album,
        })
        res.send(user)


    } catch (error) {
        console.log(error);
        res.send("Error!")
    }
})




router.get('/login', async (req, res) => {
    try {
        console.log(req.body);
        res.send('token')

    } catch (error) {
        console.log(error);
        res.send("Error!")
    }
})






module.exports = router