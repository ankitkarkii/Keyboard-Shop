import Product from "../models/Product.js";

class ProductController {
    async index(req, res) {
        try {
            const productData = await Product.find({});
            const updatedProducts = productData.map(product => {
                return {
                    ...product.toObject(),
                    image: Array.isArray(product.image)
                        ? product.image.map(img => `http://localhost:3000/products/${img}`)
                        : product.image
                };
            });
            res.status(200).json(updatedProducts);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    // New recommendation endpoint
    async recommendations(req, res) {
        try {
            // Personalized recommendation by category and price
            const { category, price, productId } = req.query;
            if (category && price) {
                const minPrice = Number(price) * 0.7; // 30% below
                const maxPrice = Number(price) * 1.3; // 30% above
                const query = {
                    categoryId: category,
                    new_price: { $gte: minPrice, $lte: maxPrice }
                };
                if (productId) {
                    query._id = { $ne: productId };
                }
                const products = await Product.find(query).limit(8);
                return res.status(200).json(products);
            }
            // Get viewed product IDs from query parameter as comma separated string
            const viewedIdsParam = req.query.viewed || '';
            const viewedIds = viewedIdsParam ? viewedIdsParam.split(',') : [];

            if (viewedIds.length === 0) {
                // If no viewed products, return popular products (latest 8)
                const popularProducts = await Product.find({})
                    .sort({ date: -1 })
                    .limit(8);
                return res.status(200).json(popularProducts);
            }

            // Find categories of viewed products
            const viewedProducts = await Product.find({ _id: { $in: viewedIds } });
            const viewedCategories = new Set(viewedProducts.map(p => p.category).filter(Boolean));

            // Find products in the same categories but not viewed
            const recommendedProducts = await Product.find({
                category: { $in: Array.from(viewedCategories) },
                _id: { $nin: viewedIds }
            }).limit(8);

            res.status(200).json(recommendedProducts);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    // Enhanced recommendation endpoint with association rules
    async enhancedRecommendations(req, res) {
        try {
            const { productId, category, price, viewed } = req.query;
            let recommendations = [];

            // First, try to get association rule recommendations
            if (productId) {
                try {
                    const AssociationRuleController = await import('./AssociationRuleController.js');
                    const arController = new AssociationRuleController.default();
                    
                    // Create a mock request object for the association rule controller
                    const mockReq = { params: { productId }, query: { limit: 4 } };
                    const mockRes = {
                        status: (code) => ({
                            json: (data) => {
                                if (code === 200 && data.recommendations) {
                                    recommendations = data.recommendations;
                                }
                            }
                        })
                    };
                    
                    await arController.getRecommendations(mockReq, mockRes);
                } catch (error) {
                    console.log('Association rule recommendation failed, falling back to traditional method');
                }
            }

            // If we don't have enough association rule recommendations, supplement with traditional method
            if (recommendations.length < 4) {
                let traditionalQuery = {};
                
                if (category && price) {
                    const minPrice = Number(price) * 0.7;
                    const maxPrice = Number(price) * 1.3;
                    traditionalQuery = {
                        categoryId: category,
                        new_price: { $gte: minPrice, $lte: maxPrice }
                    };
                    if (productId) {
                        traditionalQuery._id = { $ne: productId };
                    }
                } else if (viewed) {
                    const viewedIds = viewed.split(',');
                    const viewedProducts = await Product.find({ _id: { $in: viewedIds } });
                    const viewedCategories = new Set(viewedProducts.map(p => p.categoryId).filter(Boolean));
                    
                    traditionalQuery = {
                        categoryId: { $in: Array.from(viewedCategories) },
                        _id: { $nin: viewedIds }
                    };
                }

                const traditionalRecommendations = await Product.find(traditionalQuery)
                    .sort({ date: -1 })
                    .limit(8 - recommendations.length);

                // Combine recommendations, avoiding duplicates
                const existingIds = new Set(recommendations.map(p => p._id.toString()));
                const uniqueTraditional = traditionalRecommendations.filter(p => !existingIds.has(p._id.toString()));
                recommendations = [...recommendations, ...uniqueTraditional];
            }

            // If still no recommendations, get popular products
            if (recommendations.length === 0) {
                recommendations = await Product.find({})
                    .sort({ date: -1 })
                    .limit(8);
            }

            res.status(200).json(recommendations.slice(0, 8));
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    async store(req, res) {
        try {
            let products = req.body;

            if (!Array.isArray(products)) {
                products = [products];
            }

            const createdProducts = [];
            for (let productData of products) {
                let images = [];
                if (req.files && req.files.length > 0) {
                    images = req.files.map(file => file.filename);
                }

                const newProduct = await Product.create({ ...productData, image: images });
                createdProducts.push(newProduct);
            }

            res.status(200).json({ success: true });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }


    async show(req, res) {
        try {
            let id = req.params.id;
            const productData = await Product.findById(id)
                .populate('connectivity')
                .populate('lighting')
                .populate('polling_rate')
                .populate('color')
                .populate('body_material');
            res.status(200).json(productData);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    async showRelated(req, res) {
        try {
            const categoryId = req.query.categoryId;
            const price = parseFloat(req.query.price);
            const productId = req.query.productId;
            let query = {};
            if (categoryId) {
                query.categoryId = categoryId;
            }
            if (productId) {
                query._id = { $ne: productId };
            }
            // Fetch more products to sort by price difference
            const relatedProducts = await Product.find(query)
                .sort({ date: -1 })
                .limit(10);
    
            let sortedProducts = relatedProducts;
            if (!isNaN(price)) {
                sortedProducts = relatedProducts
                    .map(product => ({
                        product,
                        priceDiff: Math.abs(product.new_price - price)
                    }))
                    .sort((a, b) => a.priceDiff - b.priceDiff)
                    .slice(0, 4)
                    .map(item => item.product);
            } else {
                sortedProducts = relatedProducts.slice(0, 4);
            }
    
            const updatedProducts = sortedProducts.map(product => {
                return {
                    ...product.toObject(),
                    image: product.image.map(img => `http://localhost:3000/products/${img}`)
                };
            });
    
            res.status(200).json(updatedProducts);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    async update(req, res) {
        try {
            let id = req.params.id;
            let product = await Product.findById(id);
            if (!product) {
                return res.status(404).json({ message: "Product not found." });
            }
            let images = product.image;

            if (req.files && req.files.length > 0) {
                images = req.files.map(file => file.filename);
            }

            // Parse fields that should be arrays
            const parseArrayField = (field) => {
                if (!field) return [];
                if (Array.isArray(field)) return field;
                return [field];
            };

            const updatedData = {
                ...req.body,
                connectivity: parseArrayField(req.body.connectivity),
                lighting: parseArrayField(req.body.lighting),
                polling_rate: parseArrayField(req.body.polling_rate),
                color: parseArrayField(req.body.color),
                body_material: parseArrayField(req.body.body_material),
                image: images
            };

            console.log("Update product data:", updatedData);

            await Product.findByIdAndUpdate(id, updatedData);
            res.status(200).json({ success: true });
        } catch (err) {
            console.error("Error updating product:", err);
            res.status(500).json({ message: err.message, stack: err.stack });
        }
    }

    async destroy(req, res) {
        try {
            let id = req.params.id;
            await Product.findByIdAndDelete(id);
            res.status(200).json({ message: "Product Deleted Succesfully" });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    async decreaseQuantity(req, res) {
        try {
            let id = req.params.id;
            let { quantity } = req.body;
    
            if (!quantity || quantity <= 0) {
                return res.status(400).json({ message: "Invalid quantity value." });
            }
    
            let product = await Product.findById(id);
            if (!product) {
                return res.status(404).json({ message: "Product not found." });
            }
    
            if (product.quantity < quantity) {
                return res.status(400).json({ message: "Not enough stock available." });
            }
    
            product.quantity -= quantity;
            await product.save();
    
            res.status(200).json({ success: true, message: "Quantity decreased successfully.", product });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
    
    
}

export default ProductController;
