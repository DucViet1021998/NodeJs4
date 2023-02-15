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
        // // Find User exist in Database
        const user = await userModel.findOne({ username: username })

        if (!!user) {
            const passwordLogin = req.body.password
            const passwordDB = user.password

            // Check User PassWord and User Database PassWord 
            const equalCompare = await bcrypt.compare(passwordLogin, passwordDB)
            if (equalCompare === true) {

                // Success Login makes AccessToken
                const accessToken = jwt.sign({ id: user.id, username: user.username },
                    process.env.ACCESS_TOKEN_SECRET,
                    {
                        expiresIn: "600s"
                    })

                // When AccessToken expired make refreshToken
                const refreshToken = jwt.sign({ id: user.id, username: user.username },
                    process.env.REFRESH_TOKEN_SECRET
                )

                //Save Tokens to Database
                user.accessToken = accessToken
                user.refreshToken = refreshToken
                user.save()

                // Response Tokens to FrontEnd
                console.log({ accessToken: accessToken });
                return res.status(200).send({ accessToken: accessToken, refreshToken: refreshToken });
            }
            if (equalCompare === false) {
                return res.status(500).send('Your Password not compare!')
            }
        }
        else {
            res.sendStatus(404)
        }
    }
    catch (error) {
        res.send('Error!')
    }
})





router.post('/register', async (req, res) => {
    try {
        const username = req.body.username

        // Find User exist in Database
        const user = await userModel.findOne({ username: username })
        if (!!user) {
            res.sendStatus(500)
        }
        else {

            // Make Password Hashing and Save to Database
            const hashedPass = await bcrypt.hash(req.body.password, 10)
            await userModel.create({
                username: req.body.username,
                email: req.body.email,
                gender: req.body.gender,
                password: hashedPass
            })
            res.sendStatus(200)
        }

    } catch (error) {
        console.log(error);
        res.send("Error!")
    }
})



const checkToken = async (req, res, next) => {
    try {
        //Lay token tu header
        const accessToken = req.headers.authorization?.split(" ")[1];

        //Validate token -> parse payload
        const data = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

        //Tim user co token
        const user = await userModel.findById(data.id).lean();
        if (!user) {
            res.status(401).send("No user found");
        }

        //Return user req.user
        req.user = user;
        next();

    } catch (error) {
        console.log(error);
        res.status(401).send("JWT error");
    }
};

router.get("/", checkToken, async (req, res) => {
    const users = await userModel.find({}).lean();
    res.status(200).send(users);
});


router.post("/refresh-token", checkToken, async (req, res) => {
    /// Lay access token va refresh token
    const { accessToken, refreshToken } = req.body;
    const user = await userModel.findOne({ accessToken, refreshToken });
    if (!user) {
        res.status(400).send("Can not find user");
    }
    const newAccessToken = jwt.sign({ id: user.id, username: user.username },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: "600s"
        })


    const newRefreshToken = jwt.sign({ id: user.id, username: user.username },
        process.env.REFRESH_TOKEN_SECRET
    )
    // Save token -> used để refresh token
    user.accessToken = newAccessToken;
    user.refreshToken = newRefreshToken;
    user.save();

    res
        .status(200)
        .send({ accessToken: newAccessToken, refreshToken: newRefreshToken });
});



router.post("/logout", checkToken, async (req, res) => {

    //Xoa user.accessToken va user.refreshToken
    try {

        const userDB = await userModel.findOne({ username: req.user.username })
        userDB.accessToken = null;
        userDB.refreshToken = null;
        userDB.save();
        res.sendStatus(200)

    } catch (error) {
        console.log(error);
        res.status(500).send('error')
    }
});


module.exports = router