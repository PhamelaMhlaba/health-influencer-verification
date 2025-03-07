import mongoose from 'mongoose';
import Claim from '../../models/Claimjs';

// Disconnect from the database after all tests
afterAll(async () => {
  await mongoose.connection.close();
});

describe('Claim Schema Tests', () => {
  
  // Test 1: Validate that a valid claim can be created
  it('should validate a valid claim', async () => {
    // Create a mock influencer ID
    const influencerId = new mongoose.Types.ObjectId();
    
    // Create a valid claim object
    const validClaim = {
      ClaimContent: 'Eating kale daily prevents cancer',
      influencer: influencerId,
      category: 'Nutrition',
      claimDate: new Date()
    };
    
    // Create a new Claim model instance
    const claim = new Claim(validClaim);
    
    // Validate the model
    const validationError = claim.validateSync();
    
    // Expect no validation errors
    expect(validationError).toBeUndefined();
  });
  
  // Test 2: Validate that claim content is required
  it('should require the claim content field', async () => {
    // Create a mock influencer ID
    const influencerId = new mongoose.Types.ObjectId();
    
    // Create a claim without content
    const claimWithoutContent = new Claim({
      influencer: influencerId,
      category: 'Nutrition',
      claimDate: new Date()
    });
    
    // Validate the model
    const validationError = claimWithoutContent.validateSync();
    
    // Expect validation error for ClaimContent field
    expect(validationError.errors.ClaimContent).toBeDefined();
  });
  
  // Test 3: Validate that influencer reference is required
  it('should require the influencer reference', async () => {
    // Create a claim without influencer
    const claimWithoutInfluencer = new Claim({
      ClaimContent: 'Eating kale daily prevents cancer',
      category: 'Nutrition',
      claimDate: new Date()
    });
    
    // Validate the model
    const validationError = claimWithoutInfluencer.validateSync();
    
    // Expect validation error for influencer field
    expect(validationError.errors.influencer).toBeDefined();
  });
  
  // Test 4: Validate that category must be from enum
  it('should only allow valid categories', async () => {
    // Create a mock influencer ID
    const influencerId = new mongoose.Types.ObjectId();
    
    // Create a claim with invalid category
    const claimWithInvalidCategory = new Claim({
      ClaimContent: 'Eating kale daily prevents cancer',
      influencer: influencerId,
      category: 'Invalid Category', // Not in enum
      claimDate: new Date()
    });
    
    // Validate the model
    const validationError = claimWithInvalidCategory.validateSync();
    
    // Expect validation error for category field
    expect(validationError.errors.category).toBeDefined();
  });
  
  // Test 5: Validate that claim date is required
  it('should require the claim date', async () => {
    // Create a mock influencer ID
    const influencerId = new mongoose.Types.ObjectId();
    
    // Create a claim without date
    const claimWithoutDate = new Claim({
      ClaimContent: 'Eating kale daily prevents cancer',
      influencer: influencerId,
      category: 'Nutrition'
    });
    
    // Validate the model
    const validationError = claimWithoutDate.validateSync();
    
    // Expect validation error for claimDate field
    expect(validationError.errors.claimDate).toBeDefined();
  });
  
  // Test 6: Validate that verification reference can be added
  it('should allow adding a verification reference', async () => {
    // Create mock IDs
    const influencerId = new mongoose.Types.ObjectId();
    const verificationId = new mongoose.Types.ObjectId();
    
    // Create a claim with verification
    const claim = new Claim({
      ClaimContent: 'Eating kale daily prevents cancer',
      influencer: influencerId,
      category: 'Nutrition',
      claimDate: new Date(),
      verification: verificationId
    });
    
    // Expect verification to be set
    expect(claim.verification).toEqual(verificationId);
  });
});