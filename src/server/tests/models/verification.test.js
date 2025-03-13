import mongoose from 'mongoose';
import Verification from '../../models/Verification.js';

// Disconnect from the database after all tests
afterAll(async () => {
  await mongoose.connection.close();
});

describe('Verification Schema Tests', () => {
  
  // Test 1: Validate that a valid verification can be created
  it('should validate a valid verification', async () => {
    // Create a mock claim ID
    const claimId = new mongoose.Types.ObjectId();
    
    // Create a valid verification object
    const validVerification = {
      claimContent: claimId,
      status: 'Verified',
      trusScore: 85,
      source: 'Research Journal'
    };
    
    // Create a new Verification model instance
    const verification = new Verification(validVerification);
    
    // Validate the model
    const validationError = verification.validateSync();
    
    // Expect no validation errors
    expect(validationError).toBeUndefined();
  });
  
  // Test 2: Validate that claim reference is required
  it('should require the claim reference', async () => {
    // Create a verification without claim reference
    const verificationWithoutClaim = new Verification({
      status: 'Verified',
      trusScore: 85,
      source: 'Research Journal'
    });
    
    // Validate the model
    const validationError = verificationWithoutClaim.validateSync();
    
    // Expect validation error for claimContent field
    expect(validationError.errors.claimContent).toBeDefined();
  });
  
  // Test 3: Validate that status must be from enum
  it('should only allow valid status values', async () => {
    // Create a mock claim ID
    const claimId = new mongoose.Types.ObjectId();
    
    // Create a verification with invalid status
    const verificationWithInvalidStatus = new Verification({
      claimContent: claimId,
      status: 'Invalid Status', // Not in enum
      trusScore: 85,
      source: 'Research Journal'
    });
    
    // Validate the model
    const validationError = verificationWithInvalidStatus.validateSync();
    
    // Expect validation error for status field
    expect(validationError.errors.status).toBeDefined();
  });
  
  // Test 4: Validate that trust score is between 0 and 100
  it('should require trust score between 0 and 100', async () => {
    // Create a mock claim ID
    const claimId = new mongoose.Types.ObjectId();
    
    // Create a verification with invalid trust score
    const verificationWithInvalidScore = new Verification({
      claimContent: claimId,
      status: 'Verified',
      trusScore: 150, // Over 100
      source: 'Research Journal'
    });
    
    // Validate the model
    const validationError = verificationWithInvalidScore.validateSync();
    
    // Expect validation error for trusScore field
    expect(validationError.errors.trusScore).toBeDefined();
  });
  
  // Test 5: Validate that source must be from enum
  it('should only allow valid source values', async () => {
    // Create a mock claim ID
    const claimId = new mongoose.Types.ObjectId();
    
    // Create a verification with invalid source
    const verificationWithInvalidSource = new Verification({
      claimContent: claimId,
      status: 'Verified',
      trusScore: 85,
      source: 'Invalid Source' // Not in enum
    });
    
    // Validate the model
    const validationError = verificationWithInvalidSource.validateSync();
    
    // Expect validation error for source field
    expect(validationError.errors.source).toBeDefined();
  });
});