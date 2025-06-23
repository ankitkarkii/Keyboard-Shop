import mongoose from 'mongoose'

const adminSchema =new mongoose.Schema({
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true
    }
},{
    versionKey:false
});

export default mongoose.model('Admin',adminSchema)