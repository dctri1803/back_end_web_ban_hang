const mongoose = require('mongoose');
const userSchema = new mongoose.Schema(
    {
        name: { type: String },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        isAdmin: { type: Boolean, default: false, required: true },
        phone: { type: String },
        address: { type: String },
        city: { type: String },
        avatar: { type: String },
        access_token: { type: String, require: true },
        refresh_token: { type: String, require: true },
        otp: { type: String },
        otpExpiry: { type: Date }
    },
    {
        timestamps: true,
    },
);
const User = mongoose.model("User", userSchema);
module.exports = User;