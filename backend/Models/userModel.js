const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    name: { type: String },
    token: { type: String },
    walletAddress: { type: String},
    email: { type: String, unique: true },
    password: { type: String },
    contact: { type: String },
    isBlocked: { type: Boolean, default: false },
    role: { type: Object },
    address :{type:String},
    userType: { type: String, enum: ['admin', 'user'], default: 'user' },
});

// Hash the password before saving the user
UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});

UserSchema.methods.comparePassword = function(password) {
    return bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', UserSchema);
module.exports = User;
