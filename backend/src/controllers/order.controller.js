import { asyncHandler } from "../utils/asyncHandler.js";
import  User  from "../models/user.model.js";

const createOrder = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user?._id);
    if (!user) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized request"
        });
    }

    const { cart, total } = req.body;
    if (!cart || !Array.isArray(cart) || cart.length === 0) {
        return res.status(400).json({
            success: false,
            message: "Cart is empty"
        });
    }

    // Create order data object
    const orderData = {
        products: cart.map(item => ({
            name: item.product.name,
            quantity: item.quantity,
            price: item.product.price,
            subtotal: item.product.price * item.quantity
        })),
        total,
        orderDate: new Date().toISOString(),
        userId: user._id
    };

    // Clear user's cart
    user.cart = [];
    await user.save();

    return res.status(200).json({
        success: true,
        statusCode: 200,
        data: orderData,
        message: "Order placed successfully"
    });
});

export { createOrder };