import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    }
}, {
    timestamps: true,
    versionKey: false
});

// Ensure unique combination of userId and productId
cartSchema.index({ userId: 1, productId: 1 }, { unique: true });

export default mongoose.model('Cart', cartSchema);
