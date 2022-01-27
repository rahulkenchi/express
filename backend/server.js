const PORT = 7799
const express = require('express')
const mongoose = require('mongoose')
const db = "mongodb://localhost:27017/menu"
const charts = require('./db/menus')
const logger = require('./db/logger')
const orders = require('./db/order')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const jwtSecret = "randomtext"
const mail = require('./pass.json')
const fs = require('fs')
const body = fs.readFileSync('table.html')

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

const connectDB = async () => {
    try {
        await mongoose.connect(db, { useNewUrlParser: true })
        console.log("MongoDB connected")
    }
    catch (err) {
        console.log(err.message)
    }
}
connectDB();

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    //console.log(token)
    if (token == null) {
        res.json({ "err": 1, "msg": "Token not match" })
    }
    else {
        jwt.verify(token, jwtSecret, (err, data) => {
            if (err) {
                res.json({ "err": 1, "msg": "Token incorrect" })
            }
            else {
                console.log("Match")
                next();
            }
        })
    }
}

app.get("/checkmail", (req, res) => {
    const nodemailer = require("nodemailer");

    // async..await is not allowed in global scope, must use a wrapper
    async function main() {
        console.log("IN Checkmail")
        const order = [
            { "name": "rahul", "quantity": 3, "price": 432 },
            { "name": "rahul", "quantity": 3, "price": 432 },
            { "name": "rahul", "quantity": 3, "price": 432 },
            { "name": "rahul", "quantity": 3, "price": 432 },
        ]
        let total = 0
        let orderList = ''
        order.map((val, i) => {
            orderList += `<tr key=${i}>
                <td>${val.name}</td>
                <td>${val.quantity}</td>
                <td>$ ${val.price}</td>
                <td>${val.price * val.quantity}</td>
            </tr>`
            total += val.price * val.quantity
        }
        )
        // Generate test SMTP service account from ethereal.email
        // Only needed if you don't have a real mail account for testing
        // let testAccount = await nodemailer.createTestAccount();

        // create reusable transporter object using the default SMTP transport
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',   //use gmail then works
            port: 465,
            auth: {
                user: mail.user,
                pass: mail.pass
            }
        });

        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: '<rahulskenchi0@gmail.com>', // sender address
            to: "rahulskenchi0@gmail.com", // list of receivers
            subject: "Hello ", // Subject line
            // plain text body
            html: body.toString() + orderList + `</tbody></table><h2 style="text-align:right">$ ${total}</h2></</body></html>`,
            attachments: [
                {
                    filename: 'mailtrap.gif',
                    path: "https://media1.giphy.com/media/vXufyZ1LxgV6iQ4jfO/giphy.gif"
                }
            ]
        });

        console.log("Message sent: %s", info.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

        // Preview only available when sending through an Ethereal account
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    }

    main().catch(console.error);
    res.send("CHECKED");
})

app.get("/getmenu", authenticateToken, (req, res) => {
    charts.find({}, (err, data) => {
        if (err) res.send({ "err": 1, "msg": "Couldn't get menu items." });
        else {
            res.send({ "err": 0, "data": data })
        }
    })
})


app.post("/order", authenticateToken, (req, res) => {
    console.log(req.body.email)
    let tmp = new orders({ email: req.body.email, list: req.body.list })
    console.log(req.body.email)
    tmp.save((err) => {
        if (err) res.send({ "err": 1, "msg": "failed to save your orders." })
        else
            res.send({ "err": 0 })
    })
})

app.post("/log", (req, res) => {
    logger.findOne({ email: req.body.email }, (err, data) => {
        if (err) throw err;
        else {
            if (data != null) {
                if (data.password === req.body.password) {
                    let payload = {
                        email: data.email
                    }
                    const token = jwt.sign(payload, jwtSecret, { expiresIn: 3600000 })
                    res.json({ "err": 0, "msg": "Login Success", "token": token })
                    //res.send(data)
                }
                else
                    res.send({ "err": 1, "msg": "Password incorrect" })
            }
            else {
                res.send({ "err": 2, "msg": "User not found" })
            }
        }
    })
})

app.post("/signup", (req, res) => {
    let tmp = new logger({ email: req.body.email, MobileNo: req.body.MobileNo, password: req.body.password });
    tmp.save((err) => {
        if (err) res.send({ "err": 1, "msg": "Couldn't signin" });
        else {
            res.send({ 'err': 0 })
        }
    })
})

app.get("/", (req, res) => {
    throw new Error("Gone wrong")
    res.json({ "OK": "RUNS" })
})

app.get("/do", (req, res, next) => {
    try {
        res.send("enter try")
    }
    catch {
        res.send("enter catch")
    }
})

app.use((req, res, next) => {
    res.status(404).send({
        status: 404,
        error: 'Notfound'
    })
    next()
})

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(505).send("Somethiing broken")
})
app.listen(PORT, (err) => { if (err) throw err; else console.log(`Working on PORT ${PORT}`) })