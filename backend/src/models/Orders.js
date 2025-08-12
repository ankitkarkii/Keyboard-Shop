import mongoose from 'mongoose';
const { Schema } = mongoose;

const orderSchema = new Schema({
    orderedBy: {
        type: String,
        required: true
    },
    productId: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    price: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
        default: 'pending'
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'initiated', 'completed', 'failed', 'refunded'],
        default: 'pending'
    },
    paymentMethod: {
        type: String,
        enum: ['esewa', 'cod', 'card'],
        default: 'esewa'
    },
    transactionId: {
        type: String,
        sparse: true
    },
    paymentInitiatedAt: {
        type: Date
    },
    paymentCompletedAt: {
        type: Date
    },
    totalAmount: {
        type: Number,
        required: true
    },
    shippingAddress: {
        type: String,
    },
    phoneNumber: {
        type: String,
    },
    notes: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

const Order = mongoose.model('Order', orderSchema);

export default Order;
