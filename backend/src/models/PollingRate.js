import mongoose from 'mongoose';

const pollingRateSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
}, {
    versionKey: false
});

export default mongoose.model('PollingRate', pollingRateSchema);
