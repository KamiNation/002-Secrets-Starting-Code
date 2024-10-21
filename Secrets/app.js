require("dotenv").config()
const express = require("express")
const bodyParser = require("body-parser")
const ejs = require("ejs")

const mongoose = require("mongoose")
const encrypt = require("mongoose-encryption")


const app = express()

app.use(express.static("public"))
app.set("view engine", "ejs")
app.use(bodyParser.urlencoded({ extended: true }))


// connect db
mongoose.connect("mongodb://localhost:27017/userDB", { useNewUrlParser: true })

// user schema
const userSchema = new mongoose.Schema({
    email: String,
    password: String
})


// this encrypts the password field in the db alone
userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedField: ["password"]})


// use userschema to setup new user model
// the "User" in model is the collection name
const User = new mongoose.model("User", userSchema)

app.get("/", (req, res) => {
    res.render("home")
})

app.get("/login", (req, res) => {
    res.render("login")
})

app.get("/register", (req, res) => {
    res.render("register")
})


app.post("/register", async (req, res) => {

    try {
        // create new user with model
        const newUser = new User({
            email: req.body.username,
            password: req.body.password
        })

        // save new user to db
        await newUser.save()
        res.render("secrets")

    } catch (error) {
        console.log(error);

    }
})


app.post("/login", async (req, res) => {

    try {
        // check if user exist
        const username = req.body.username;
        const password = req.body.password;

        const foundUser =  await User.findOne({
            email: username
        })

        console.log(foundUser);
        
        if (foundUser){
            foundUser.password === password
        }

        res.render("secrets")


    } catch (error) {
        console.log(error);

    }
})


app.listen(3000, () => {
    console.log("Server started on port 3000");

})