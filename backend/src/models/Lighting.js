import mongoose from 'mongoose';

const lightingSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
}, {
    versionKey: false
});

export default mongoose.model('Lighting', lightingSchema);
