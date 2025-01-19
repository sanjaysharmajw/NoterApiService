// const userModel = require("../model/user");
const userModel = require("../model/user")
require('dotenv').config(); 
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


const signup = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const existingUser = await userModel.findOne({ email: email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        const hashPassword = await bcrypt.hash(password, 10);
        const result = await userModel.create({
            email: email,
            password: hashPassword,
            username: username,
        });

        const token = jwt.sign({ email: result.email, id: result._id },process.env.SECRET_KEY);
        res.status(200).json({ user: result, token: token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong" });
    }
};

const signin = async (req, res) => {
    const { email, password } = req.body;
    try {
        // Find the user by email
        const existingUser = await userModel.findOne({ email: email });
        if (!existingUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if the password matches
        const matchPassword = await bcrypt.compare(password, existingUser.password);
        if (!matchPassword) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }

        // Generate a JWT token
        const token = jwt.sign({ email: existingUser.email, id: existingUser._id },process.env.SECRET_KEY,{ expiresIn: "1h" });

        // Respond with user data and token
        res.status(200).json({
            data: [
                {
                    id: existingUser._id,
                    username: existingUser.username,
                    password: existingUser.password,
                    email: existingUser.email,
                    token: token,
                },
            ],
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong" });
    }
};





module.exports = { signup, signin };
