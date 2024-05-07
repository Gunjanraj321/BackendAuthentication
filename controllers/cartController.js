const Cart = require("../models/cart");

const addToCart = async (req, res) => {
  const { quantity, title, price, imageUrl } = req.body;
  const userId = req.user.userId;

  try {
    const cartItem = await Cart.findOne({ where: { userId, title } });
    if (cartItem) {
      cartItem.quantity += quantity;
      await cartItem.save();
      // console.log(`cart updated`);
    } else {
      await Cart.create({ userId, quantity, price, title, imageUrl });
      // console.log(`cart Added`);
    }
    res.status(201).json({
      success: true,
      message: "Item added to cart",
      cartItem: cartItem,
    });
  } catch (err) {
    return { success: false, error: err.message };
  }
};

const getCart = async (req, res) => {
  const userId = req.user.userId;
  try {
    const cartItem = await Cart.findAll({ where: { userId } });
    // console.log(`cart fetched`);

    res.status(201).json(cartItem);
  } catch (err) {
    return { success: false, error: err.message };
  }
};

const clearCart = async (req, res) => {
  const userId = req.user.userId; // Assuming you have user authentication middleware
  try {
    // Delete all cart items for the user
    await Cart.destroy({ where: { userId } });
    // console.log(`cart deleted`);

    res
      .status(200)
      .json({ success: true, message: "Cart cleared successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const removeCart = async (req, res) => {
  const userId = req.user.userId;
  const { id } = req.params;

  try {
    const cartItem = await Cart.findOne({ where: { id } });

    if (!cartItem) {
      return res
        .status(404)
        .json({ success: false, message: "Item not found in the cart" });
    }

    cartItem.quantity -= 1;

    if (cartItem.quantity <= 0) {
      await cartItem.destroy();
    } else {
      await cartItem.save();
    }
    const updatedCartItems = await Cart.findAll({ where: { userId } });

    res.status(200).json({
      success: true,
      message: "Item quantity decreased in cart",
      updatedCartItems,
    });
  } catch (error) {
    // console.error("Error decreasing item quantity in cart:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { addToCart, getCart, clearCart, removeCart };
