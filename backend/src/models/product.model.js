import mongoose from 'mongoose'


const productSchema = new mongoose.Schema({
    'name': {
        type: String,
        required: true,
    },
    'photo': {
        type: String,
        required: true
    },
    'price': {
        type: Number,
        required: true,
    },
    'description': {
        type: String,
        default: "No description given here"
    },
    'owner': {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    'category':{
        type: String,
        enum: ['Fruits', 'Vegetables', 'Dairy Products', 'Farm Core', 'Dryfruits'],
        required: true
    },
    'region':{
        type: String,
        enum: ['Northern India', 'Southern India', 'Eastern India', 'Western India', 'Central India', 'Northeastern India'],
        required: true
    }
}, {timestamps : true})


const Product = mongoose.model("Product", productSchema)

export default Product