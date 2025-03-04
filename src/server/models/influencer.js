import mongoose from 'mongoose';

const InfluencerSchema = new mongoose.Schema({
  // Store influencer name (required, trimmed)
  name: {
    type: String,
    required: [true, 'Influencer name is required'],
    trim: true
  },

  // Include social media links
  socialMedia: {
    twitter: String,
    instagram: String,
    youtube: String
  },

  // Store follower count (default: 0, cannot be negative)
  followers: {
    type: Number,
    default: 0,
    min: [0, 'Follower count cannot be negative']
  },

  // Establish relationship with Claim model
  claims: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Claim'
  }]
}, {

  // Add timestamps for createdAt & updatedAt
  timestamps: true
});

const Influencer = mongoose.model('Influencer', InfluencerSchema);

export default Influencer;