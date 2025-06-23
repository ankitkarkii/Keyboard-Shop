import mongoose from 'mongoose';

const connectivitySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
}, {
    versionKey: false
});

export default mongoose.model('Connectivity', connectivitySchema);
