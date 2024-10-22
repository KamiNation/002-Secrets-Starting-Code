require("dotenv").config()
const express = require("express")
const bodyParser = require("body-parser")
const ejs = require("ejs")
const md5 = require("md5")
const mongoose = require("mongoose")
// const encrypt = require("mongoose-encryption")
const bcrypt = require("bcrypt")


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
// userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedField: ["password"]})


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

    const password = req.body.password
    console.log(password);


    try {

        const salt = await bcrypt.genSalt(5);  // Generate a salt
        const hashedpassword = await bcrypt.hash(password, salt);  // Hash the password


        console.log(hashedpassword);


        // create new user with model
        const newUser = new User({
            email: req.body.username,
            password: hashedpassword
        })

        // save new user to db
        newUser.save()
        res.render("secrets")



    } catch (error) {
        console.log(error);

    }
})


app.post("/login", async (req, res) => {

    try {
        // check if user exist
        const username = req.body.username;
        const password = req.body.password


        const foundUser = await User.findOne({
            email: username
        })

        console.log(foundUser);

        const passDB = await bcrypt.compare(password, foundUser.password);


        if (foundUser && passDB) {
            res.render("secrets")
        }



    } catch (error) {
        console.log(error);

    }
})


app.listen(3000, () => {
    console.log("Server started on port 3000");

})