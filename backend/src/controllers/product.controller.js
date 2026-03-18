import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import Product from "../models/product.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import User from "../models/user.model.js";
import fs from 'fs/promises'
import mongoose from 'mongoose'


const createProduct = async (req, res) => {
    try{
        const {name, price, description, category, region, owner} = req.body
        const photoLocalPath = req.file?.path

        console.log(name, price, description, category, region, owner, photoLocalPath)

        let photo = await uploadOnCloudinary(photoLocalPath)
        photo = photo?.url
        await fs.unlink(photoLocalPath)
        if (!name || !price || !description || !category || !region) {
            throw new ApiError(400, "Please Fill all the fields")
        }
        if (!photo){
            throw new ApiError(400, "Photo is required")
        }

        const product = await Product.create({
            name, price, description, category, region, photo, owner
        })

        const user = await User.findById(owner)

        console.log(user.products)

        if (user.products){
            user.products = [...user.products, product._id]
        }
        else{
            user.products = [product._id]
        }

        await user.save({validateBeforeSave:false})

        return res
        .status(200)
        .json(
            new ApiResponse(200, "Product successfully created")
        )

    } catch(err){
        return res.status(400).json(err.message)
    }
}

const searchProduct = async (req, res) => {
    try{
        let search = req.body.search
        console.log(search)
        let products = await Product.find({name:{$regex:search}})
        console.log(products)
        for (let product of products){
            product.owner = await User.findOne({_id: product.owner})
        }
        return res
        .status(200)
        .json(products)
    }
    catch(err){
        console.log(err.message)
        return res
        .status(401)
        .json(err.message)
    }
}

const filterProduct = async (req, res) => {
    try{
        let category = req.body.category
        let region = req.body.region
        if (!category && !region) throw new ApiError(401, "Fill all fields");
        let query = {}
        if (category!="All" && category) query.category = category;
        if (region!="All" && region) query.region = region;
        let products = await Product.find(query)
        for (let product of products){
            product.owner = await User.findOne({_id: product.owner})
        }
        return res
        .status(200)
        .json(products)
    }
    catch(err){
        console.log(err.message)
        return res
        .status(401)
        .json(err.message)
    }
}

const addToCart = async (req, res) => {
    try {
        const user = req.user;
        const productId = new mongoose.Types.ObjectId(req.body.productId);

        let cart = user.cart;
        let existingItem = cart.find(item => item.product.equals(productId));

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ product: productId, quantity: 1 });
        }

        const updatedUser = await User.findOneAndUpdate(
            { username: user.username },
            { $set: { cart } }, // Update only the cart field
            { new: true } // Return updated user
        ).populate("cart.product"); // Populate product details

        return res.status(200).json({ cart: updatedUser.cart });
    } 
    catch (err) {
        return res.status(400).json({ message: err.message });
    }
};


const removeFromCart = async (req, res) => {
    try {
        const user = req.user;
        const productId = new mongoose.Types.ObjectId(req.body.productId);

        let cart = user.cart;
        let existingItem = cart.find(item => item.product.equals(productId));

        if (existingItem) {
            if (existingItem.quantity > 1) {
                existingItem.quantity -= 1;
            } else {
                cart = cart.filter(item => !item.product.equals(productId)); // Remove item if quantity is 1
            }
        } else {
            return res.status(400).json({ message: "Product not found in cart" });
        }

        const updatedUser = await User.findOneAndUpdate(
            { username: user.username },
            { $set: { cart } },
            { new: true } // Return updated user
        ).populate("cart.product"); // Populate product details

        return res.status(200).json({ cart: updatedUser.cart });
    } 
    catch (err) {
        return res.status(400).json({ message: err.message });
    }
};


const getCart = async (req, res) => {
    try{
        const user = req.user

        let cart = []

        for (let item of user.cart){
            cart.push({product: await Product.findById(item.product), quantity: item.quantity})
        }

        return res
        .status(200)
        .json({cart: cart})
    }
    catch(err){
        return res
        .status(401)
        .json({message: err.message})
    }
}

const deleteFromCart = async (req, res) => {
    try{
        const user = req.user
        const productId = new mongoose.Types.ObjectId(req.body.productId)
        const cart = user.cart.filter((item) => !item.product.equals(productId))
        const updatedUser = await User.findOneAndUpdate(
            { username: user.username },
            { $set: { cart: cart } }
        )
        return res
        .status(200)
        .json({cart: cart})
    }
    catch(err){
        return res
        .status(400)
        .json({message: err.message})
    }
}


export {createProduct, searchProduct, filterProduct, addToCart, removeFromCart, getCart, deleteFromCart}