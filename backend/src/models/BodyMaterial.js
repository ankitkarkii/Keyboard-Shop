import mongoose from 'mongoose';

const bodyMaterialSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
}, {
    versionKey: false
});

export default mongoose.model('BodyMaterial', bodyMaterialSchema);
