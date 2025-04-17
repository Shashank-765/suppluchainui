const jwt = require('jsonwebtoken');
const { ethers } = require('ethers');
const bcrypt = require('bcryptjs');
const User = require('../Models/userModel.js');
const mnemonic = process.env.mnemonic;




const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

const generateWallet = async () => {
    try {
    console.log("mnemonic from env:", mnemonic);
        const patientCount = await User.countDocuments();
        const hdNode = ethers.HDNodeWallet.fromPhrase(mnemonic);
        const wallet = hdNode.deriveChild(patientCount);

        return {
            address: wallet.address,
        };
    } catch (error) {
        throw new Error("Wallet creation failed: " + error.message);
    }
};

module.exports = {
    generateToken,
    generateWallet
};
