import Category from "../models/Category.js";

class CategoryController{
    async index(req,res){
        try{
            const categoryData=await Category.find({});
            res.status(200).json(categoryData);
        }catch(err){
            res.status(500).json({message:err.message})
        }
    }

    async store(req,res){
        try{
            await Category.create({...req.body});
            res.status(200).json({message:"Category Added"});
        }catch(err){
            res.status(500).json({message:err.message});
        }
    }

        // Update category by ID
    async update(req, res) {
        try {
            const { id } = req.params;
            const { cat_name } = req.body;

            const updatedCategory = await Category.findByIdAndUpdate(
                id,
                { cat_name },
                { new: true }
            );

            if (!updatedCategory) {
                return res.status(404).json({ message: "Category not found" });
            }

            res.status(200).json({ message: "Category Updated", category: updatedCategory });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    // Delete category by ID
    async delete(req, res) {
        try {
            const { id } = req.params;
            const deletedCategory = await Category.findByIdAndDelete(id);

            if (!deletedCategory) {
                return res.status(404).json({ message: "Category not found" });
            }

            res.status(200).json({ message: "Category Deleted" });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
}

export default CategoryController;