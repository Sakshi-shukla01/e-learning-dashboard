// controllers/cartController.js
import Cart from "../models/Cart.js";

// Add a course to the cart
export const addToCart = async (req, res) => {
  const userId = req.user.id;
  const { courseId, title, image, description } = req.body;

  try {
    let cart = await Cart.findOne({ user: userId });
    if (!cart) cart = new Cart({ user: userId, courses: [] });

    const exists = cart.courses.find((c) => c.courseId.toString() === courseId);
    if (exists) return res.status(400).json({ message: "Course already in cart" });

    cart.courses.push({ courseId, title, image, description });
    await cart.save();

    res.status(200).json({ message: "Course added to cart", cart });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all courses in the user's cart
export const getCart = async (req, res) => {
  const userId = req.user.id;
  try {
    const cart = await Cart.findOne({ user: userId });
    res.status(200).json({ cart: cart ? cart.courses : [] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Remove a course from the cart
export const removeFromCart = async (req, res) => {
  const userId = req.user.id;
  const { courseId } = req.body;

  try {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.courses = cart.courses.filter((c) => c.courseId.toString() !== courseId);
    await cart.save();

    res.status(200).json({ message: "Course removed from cart", cart });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
