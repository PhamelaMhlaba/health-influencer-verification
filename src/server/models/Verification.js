import mongoose from 'mongoose';

// Step 1: Define Schema for Verifications.

const  verificationSchema = new mongoose.Schema(
  {

// Step 2: Store Claim content
    claimContent: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Claim'
    },

// Step 3: Verfication status of claims
    status: {
        type: String,
        enum: ['Verified', 'Questionable', 'Debunked'],
        required: true
    }, 

// Step 4: Define trust score of the claims

    trusScore: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },

// Step 5: Define verfication claim source
    source: {
        type: String,
        enum: ['AI Model', 'Research Journal' ],
        required: true
    }
  },
    { timestamps: true }
);

// Create and export the Verification model using ES module syntax
const Verification = mongoose.model('Verification', verificationSchema);
export default Verification;
