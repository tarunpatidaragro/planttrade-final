import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    price: Number,
    category: String,
    description: String,
    benefits: String,
    image: String,
    gallery: [String],
    rating: { type: Number, default: 4.5 },

    nurseryId: { type: String, required: true },
    isRescue: { type: Boolean, default: false },

    createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
