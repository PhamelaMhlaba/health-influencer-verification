import mongoose from 'mongoose;'

// Step 1: Define the schema for the Claim
const ClaimSchema= new mongoose.Schema ({
    
// Step 2: Store the claim content(required and trimmed)  
    ClaimContent : {
        type: String,
        required: true,
        trim: true
    },

// Step 3: Associate each claim with an influencer
    influencer: {
        type: mongoose.Schema.Types.ObjectId,
        red: 'Infleuncer',
        required: [true, 'Infleuncer reference is requiered'],
    },

//  Step 4: Claim category (Enum to ensure data consistency)
    category: {
        type: String,
        enum: ['Nutrition', 'Medicine', 'Mental Health'],
        required:[true,'Claim category is required']
    },

// Step 5: Store the date for the claim(required)
    claimDate: {
        type: Date,
        required: [true, 'Claim date is required']
    },

// Step 6: Establish relationship with the Verification model via ObjectId reference
  verification: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Verification' // Reference to the Verification model
  }
}, {
    
  // Step 7: Add timestamps (createdAt & updatedAt)
  timestamps: true
});

// Step 8: Create the Claim model
const Claim = mongoose.model('Claim', ClaimSchema);

// Step 9: Export the Claim model
export default Claim;
