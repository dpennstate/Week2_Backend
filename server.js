const express = require('express');
const session = require("express-session")
const app = express();
const {connectDB, createUser} = require('./db')
const bodyParser = require('body-parser')
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Credentials", "true");
    next();
});
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
const PORT = process.env.PORT || 8080

app.use(
    session({
        secret: "TempSecretKey",
        resave: true,
        saveUninitialized: true
    })
)
app.post('/user/loginThirdParty', (req, res) => {

    try {
        if (req.body === undefined || req.body === null || req.body.usercred === undefined || req.body.usercred === null) {
            res.status(400).send({user: null, message: "Request failed"})
            return
        }
        const parsedData =  JSON.parse(Buffer.from(req.body.usercred.split('.')[1], 'base64').toString())
        if (parsedData === undefined || parsedData === null || parsedData.email === undefined || parsedData === null ||
            parsedData.given_name === undefined || parsedData.given_name === null ||
            parsedData.family_name === undefined || parsedData.family_name === null) {
            res.status(400).send({user: null, message: "Request failed"})
            return
        }
        if (req.session.user !== undefined && req.session.user.useremail !== undefined && req.session.user.useremail !== "") {
            res.status(500).send({user: null, message: "Already Logged In"})
            return
        }
        const success = createUser(parsedData.email, parsedData.given_name, parsedData.family_name)

        if (success) {
            // req.session.user = {useremail: parsedData.email}
            res.status(200).send({user: {email: parsedData.email, firstname: parsedData.given_name, lastname: parsedData.family_name}, message: "Request Passed"})
            return
        }

        res.status(500).send({user: null, message: "Request failed"})

    }catch (error) {
        console.log(error)
        res.status(500).send({user: null, message: "Request failed"})
    }

})

app.post('/user/logout', (req, res) => {
    try {
        req.session.destroy((err) => {
            if (err) {
                console.log(err)
                res.status(500).send({message: "Error logging out"})
                return
            }
            else {
                // res.clearCookie('connection.sid', {path: '/'})
                res.cookie('connect.sid', '')
                // res.clearCookie('connect.sid', {path: '/'})
                // res.clearCookie('g_state', {path: '/'})
                res.status(200).send({message: "Logged out"})
            }
        })
    }catch (error) {
        res.status(500).send({message: "Error logging out"})

    }
    delete req.session.user
    req.session.authenticated = false;
})

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`)
    })
})