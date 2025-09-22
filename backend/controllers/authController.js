import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

//TODO Generate JWT Token
const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

//* @desc Register a new user
//* @route POST /api/auth/signup
const signupUser = async (req, res) => {
    try{
        const { name, email, password, profileImageUrl, adminInviteToken} = req.body;

        //TODO Check if user already exists
        const userExists = await User.findOne({ email});
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        //! Determine user role based on Admin if correct invite token is provided otherwise assign "member" role
        let role = "member";
        if(
            adminInviteToken &&
            adminInviteToken === process.env.ADMIN_INVITE_TOKEN
        ){
            role = "admin";
        }

        //TODO Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        //TODO Create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            profileImage: profileImageUrl || null,
            role
        });

        //* Return user data with token
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            profileImageUrl: user.profileImageUrl,
            token: generateToken(user._id)
        });

    }catch(error){
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

//* @desc Login a user
//* @route POST /api/auth/login
const loginUser = async (req, res) => {
    try{
        const { email, password } = req.body;

        //TODO Check for user email
        const user = await User.findOne({ email });
        if (!user){
            return res.status(400).json({ message: "Invalid email or password" });
        }

        //TODO Check for password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch){
            return res.status(400).json({ message: "Invalid email or password" });
        }

        //* Return user data with token
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            profileImageUrl: user.profileImageUrl,
            token: generateToken(user._id)
        });
    }catch(error){
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

//* @desc Get user profile
//* @route GET /api/auth/profile
//! @access Private(Requires token)
const getUserProfile = async (req, res) => {
    try{
        const user = await User.findById(req.user._id).select("-password");
        if (!user){
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    }catch(error){
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

//* @desc Update user profile
//* @route PUT /api/auth/profile
//! @access Private(Requires token)
const updateUserProfile = async (req, res) => {
    try{
        const user = await User.findById(req.user.id);
        if (!user){
            return res.status(404).json({ message: "User not found" });
        }

        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;

        if (req.body.password){
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(req.body.password, salt);
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            profileImageUrl: updatedUser.profileImageUrl,
            token: generateToken(updatedUser._id)
        });
    }catch(error){
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

export { signupUser, loginUser, getUserProfile, updateUserProfile };