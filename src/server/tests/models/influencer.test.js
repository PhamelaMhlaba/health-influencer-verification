import mongoose from 'mongoose';
import Influencer from '../../models/Influencerjs';

// Disconnect from the database after all tests
afterAll(async () => {
  await mongoose.connection.close();
});

describe('Influencer Schema Tests', () => {
  
  // Test 1: Validate that a valid influencer can be created
  it('should validate a valid influencer', async () => {
    // Create a valid influencer object
    const validInfluencer = {
      name: 'Health Expert',
      socialMedia: {
        twitter: 'https://twitter.com/healthexpert',
        instagram: 'https://instagram.com/healthexpert',
        youtube: 'https://youtube.com/healthexpert'
      },
      followers: 5000
    };
    
    // Create a new Influencer model instance
    const influencer = new Influencer(validInfluencer);
    
    // Validate the model
    const validationError = influencer.validateSync();
    
    // Expect no validation errors
    expect(validationError).toBeUndefined();
  });
  
  // Test 2: Validate that name is required
  it('should require the name field', async () => {
    // Create an influencer without a name
    const influencerWithoutName = new Influencer({
      socialMedia: {
        twitter: 'https://twitter.com/healthexpert'
      },
      followers: 1000
    });
    
    // Validate the model
    const validationError = influencerWithoutName.validateSync();
    
    // Expect validation error for name field
    expect(validationError.errors.name).toBeDefined();
    expect(validationError.errors.name.message).toBe('Influencer name is required');
  });
  
  // Test 3: Validate that followers cannot be negative
  it('should not allow negative follower count', async () => {
    // Create an influencer with negative followers
    const influencerWithNegativeFollowers = new Influencer({
      name: 'Health Expert',
      followers: -10
    });
    
    // Validate the model
    const validationError = influencerWithNegativeFollowers.validateSync();
    
    // Expect validation error for followers field
    expect(validationError.errors.followers).toBeDefined();
    expect(validationError.errors.followers.message).toBe('Follower count cannot be negative');
  });
  
  // Test 4: Validate default values
  it('should set default follower count to 0', async () => {
    // Create an influencer without specifying followers
    const influencer = new Influencer({
      name: 'Health Expert'
    });
    
    // Expect followers to be 0
    expect(influencer.followers).toBe(0);
  });
  
  // Test 5: Validate that claims can be added
  it('should allow adding claims', async () => {
    // Create a mock claim ID
    const claimId = new mongoose.Types.ObjectId();
    
    // Create an influencer with a claim
    const influencer = new Influencer({
      name: 'Health Expert',
      claims: [claimId]
    });
    
    // Expect claims array to contain the claim ID
    expect(influencer.claims).toHaveLength(1);
    expect(influencer.claims[0]).toEqual(claimId);
  });
  
  // Test 6: Validate that timestamps are added
  it('should add timestamps when saved', async () => {
    // Create a test database connection
    await mongoose.connect('mongodb://localhost:27017/test-db', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    // Clear the collection
    await Influencer.deleteMany({});
    
    // Create and save an influencer
    const influencer = new Influencer({
      name: 'Health Expert'
    });
    
    await influencer.save();
    
    // Expect timestamps to be defined
    expect(influencer.createdAt).toBeDefined();
    expect(influencer.updatedAt).toBeDefined();
    
    // Clean up
    await Influencer.deleteMany({});
  });
});