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
    image: [{
        type: String
    }],
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
    connectivity: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Connectivity'
    }],
    lighting: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lighting'
    }],
    polling_rate: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PollingRate'
    }],
    color: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Color'
    }],
    body_material: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BodyMaterial'
    }],
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
    if (obj.image && obj.image.length > 0) {
        obj.image = obj.image.map(img => process.env.PUBLIC_URL + "/products/" + img);
    } else {
        obj.image = [process.env.PUBLIC_URL + "/icons/notFound.png"];
    }

    return obj;
};

export default mongoose.model('Product', productSchema);
