import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    image: {
        type: String
    },
    new_price: {
        type: Number,
        required: true
    },
    old_price: {
        type: Number
    },
    quantity: {
        type: Number,
        required: true
    },
    description: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    },
    available: {
        type: Boolean,
        default: true
    }
}, {
    versionKey: false
});

productSchema.methods.toJSON = function () {
    var obj = this.toObject();
    if (obj.image) {
        obj.image = process.env.PUBLIC_URL + "/products/" + obj.image;
    } else {
        obj.image = process.env.PUBLIC_URL + "/icons/notFound.png";
    }

    return obj;
};

export default mongoose.model('Product', productSchema);
