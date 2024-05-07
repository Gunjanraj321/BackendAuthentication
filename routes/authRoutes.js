const express = require("express");
const router = express.Router();
const { verify } = require("../services/verifyToken");

const { signup, login ,authCheck, UpdatePassword } = require("../controllers/authControllers");
const {addToCart, getCart, clearCart, removeCart} = require("../controllers/cartController");

router.post("/signup", signup);

router.post("/login", login);

router.post('/auth',verify,authCheck);

router.post("/update",verify, UpdatePassword);

router.post("/cart",verify,addToCart);

router.get("/cart" ,verify, getCart);

router.delete("/clearCart",verify , clearCart)

router.put("/cart/:id",verify,removeCart)

module.exports = router;
