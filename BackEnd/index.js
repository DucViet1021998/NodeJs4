const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

app.use(express.json())
app.use(morgan('combined'))
app.use(express.urlencoded());
app.use(cors())

app.post("/login", async (req, res) => {
    try {
        const token = "token";
        res.send(token);
    } catch (error) {
        console.log(error);
    }
});



app.listen(3010)