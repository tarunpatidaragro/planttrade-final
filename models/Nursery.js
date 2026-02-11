import mongoose from 'mongoose';

const NurserySchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: [true, 'Please provide a nursery name'] },
    description: String,
    image: String,
    gallery: [String],
    specialties: [String],
    rating: Number,
    farmersCount: Number,
    website: String,

    location: String, // "Pune, Maharashtra"
    lat: Number,
    lng: Number,
    googleMapEmbedUrl: String,

    contact: {
        person: String,
        phone: { type: String, required: [true, 'Please provide a phone number'] },
        email: String,
        address: String,
        city: String,
        state: String,
        pincode: String
    },

    social: {
        instagram: String,
        facebook: String,
        whatsapp: String,
        youtube: String
    },

    createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Nursery || mongoose.model('Nursery', NurserySchema);
