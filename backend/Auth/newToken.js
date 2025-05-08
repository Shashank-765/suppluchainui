const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken')
const {generateToken}= require('./Authenticate')


router.post("/newtoken", (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) {
    console.log("No refresh token found in cookies");
    return res.status(401).json({ message: "No refresh token" });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log("Token verification failed:", err);
      return res.status(403).json({ message: "Invalid token" });
    }
    console.log("Token successfully decoded:", decoded);
    const accessToken = generateToken(decoded.id);
    res.json({ accessToken });
  });
});


module.exports = router;
