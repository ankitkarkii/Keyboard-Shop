import mongoose from 'mongoose'

const categorySchema =new mongoose.Schema({
    cat_name:{
        type:String,
        required:true,
    }
},{
    versionKey:false
});

export default mongoose.model('Category',categorySchema)