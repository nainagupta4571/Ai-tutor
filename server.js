const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const path = require("path");
require("dotenv").config();

const User = require("./models/User");

const app = express();


// ==============================
// MIDDLEWARE
// ==============================

app.use(express.json());


// ==============================
// SERVE PUBLIC FOLDER
// ==============================

app.use(express.static(path.join(__dirname, "public")));


// ==============================
// MONGODB
// ==============================

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected!");
    })
    .catch((error) => {
        console.log("MongoDB connection error:", error);
    });


// ==============================
// HOME
// ==============================

app.get("/", (req, res) => {
    res.send("AI Tutor Backend is working!");
});


// ==============================
// REGISTER API
// ==============================

app.post("/api/register", async (req, res) => {

    try {

        const { name, email, password } = req.body;


        // Check fields
        if (!name || !email || !password) {

            return res.status(400).json({
                message: "Please fill all fields"
            });

        }


        // Check password
        if (password.length < 6) {

            return res.status(400).json({
                message: "Password must be at least 6 characters"
            });

        }


        // Check existing user
        const existingUser = await User.findOne({
            email: email.toLowerCase()
        });


        if (existingUser) {

            return res.status(400).json({
                message: "Email already registered"
            });

        }


        // Hash password
        const hashedPassword = await bcrypt.hash(
            password,
            10
        );


        // Create user
        const newUser = new User({

            name: name,

            email: email.toLowerCase(),

            password: hashedPassword

        });


        // Save user
        await newUser.save();


        console.log(
            "New user registered:",
            email
        );


        res.status(201).json({

            message: "Registration successful!"

        });


    } catch (error) {

        console.log(
            "Registration error:",
            error
        );


        res.status(500).json({

            message: "Server error"

        });

    }

});


// ==============================
// START SERVER
// ==============================

const PORT = process.env.PORT || 5000;


app.listen(PORT, () => {

    console.log(
        `Server running on http://localhost:${PORT}`
    );

});