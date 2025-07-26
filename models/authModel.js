import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "username is required"],
        lowercase: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/.+\@.+\..+/, "Please provide a valid email address"],
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Password must be at least 6 characters long"],
        select: false, // prevents password from being returned in queries by default
    }
},
    {
        timestamps: true
    })

const Admin = mongoose.model("Admin", adminSchema)
export default Admin