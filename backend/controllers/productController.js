const Product = require('../models/Product');

// @desc    Get all products (with optional filtering)
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res) => {
    try {
        let query;

        // Copy req.query
        const reqQuery = { ...req.query };

        // Fields to exclude from direct matching
        const removeFields = ['select', 'sort', 'page', 'limit', 'search', 'niche'];
        removeFields.forEach(param => delete reqQuery[param]);

        // Create query string for advanced operators ($gt, $gte, etc)
        let queryStr = JSON.stringify(reqQuery);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

        // Finding resource
        query = Product.find(JSON.parse(queryStr));

        // Niche filtering
        if (req.query.niche) {
            query = query.find({ niche: req.query.niche });
        }

        // Search filtering
        if (req.query.search) {
            query = query.find({
                $or: [
                    { name: { $regex: req.query.search, $options: 'i' } },
                    { brand: { $regex: req.query.search, $options: 'i' } }
                ]
            });
        }

        // Select Fields
        if (req.query.select) {
            const fields = req.query.select.split(',').join(' ');
            query = query.select(fields);
        }

        // Sort
        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        } else {
            query = query.sort('-createdAt');
        }

        const products = await query;
        res.json({ success: true, count: products.length, data: products });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
exports.getProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json(product);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// @desc    Create new product
// @route   POST /api/products
// @access  Private/Admin
exports.createProduct = async (req, res) => {
    try {
        const product = await Product.create(req.body);
        res.status(201).json({ success: true, data: product });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
exports.updateProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json(product);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        await product.deleteOne();
        res.json({ success: true, message: 'Product removed' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
