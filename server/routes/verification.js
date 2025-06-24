const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { supabase, supabaseAdmin } = require('../config/supabase');
const crypto = require('crypto');
const sharp = require('sharp');
const axios = require('axios');
const emailService = require('../services/emailService');

// Get verification status for the current user
router.get('/status', auth, async (req, res) => {
  try {
    const userId = req.user.id;

    // Check if this is a demo user
    if (req.user.isDemo) {
      console.log('Demo user detected, returning mock verification status');

      // Return mock verification status for demo users
      return res.json({
        emailVerified: true,
        phoneVerified: true,
        hasPhone: true,
        identityVerified: false,
        faceVerified: false,
        status: 'pending',
        lastUpdated: new Date().toISOString(),
        isDemo: true
      });
    }

    // Get verification status from user_verification table
    const { data: verificationData, error: verificationError } = await supabase
      .from('user_verification')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (verificationError && verificationError.code !== 'PGRST116') {
      console.error('Error fetching verification status:', verificationError);
      return res.status(500).json({ message: 'Error fetching verification status' });
    }

    // Get user data for email and phone verification status
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('email_verified, phone_verified, phone')
      .eq('id', userId)
      .single();

    if (userError && userError.code !== 'PGRST116') {
      console.error('Error fetching user verification status:', userError);
      return res.status(500).json({ message: 'Error fetching user verification status' });
    }

    // If no verification data found, create default values
    const userDataDefaults = {
      email_verified: false,
      phone_verified: false,
      phone: null
    };

    // Combine verification data
    const verificationStatus = {
      emailVerified: userData?.email_verified || userDataDefaults.email_verified,
      phoneVerified: userData?.phone_verified || userDataDefaults.phone_verified,
      hasPhone: !!(userData?.phone || userDataDefaults.phone),
      identityVerified: verificationData?.identity_verified || false,
      faceVerified: verificationData?.face_verified || false,
      status: verificationData?.verification_status || 'pending',
      lastUpdated: verificationData?.updated_at || new Date().toISOString()
    };

    res.json(verificationStatus);
  } catch (error) {
    console.error('Error in verification status endpoint:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Send email verification code
router.post('/send-email-code', auth, async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user email
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('email, email_verified')
      .eq('id', userId)
      .single();

    if (userError) {
      console.error('Error fetching user email:', userError);
      return res.status(500).json({ message: 'Error fetching user data' });
    }

    if (userData.email_verified) {
      return res.status(400).json({ message: 'Email is already verified' });
    }

    // Generate verification code (6 digits)
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Set expiration time (15 minutes from now)
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 15);

    // Delete any existing email verification codes for this user
    await supabaseAdmin
      .from('verification_codes')
      .delete()
      .match({ user_id: userId, type: 'email' });

    // Insert new verification code
    const { error: insertError } = await supabaseAdmin
      .from('verification_codes')
      .insert([{
        user_id: userId,
        code: verificationCode,
        type: 'email',
        expires_at: expiresAt.toISOString(),
        created_at: new Date().toISOString()
      }]);

    if (insertError) {
      console.error('Error creating verification code:', insertError);
      return res.status(500).json({ message: 'Error creating verification code' });
    }

    // Send the actual verification email
    const emailResult = await emailService.sendVerificationEmail(
      userData.email,
      verificationCode,
      req.user.name
    );

    if (!emailResult.success) {
      console.error('Failed to send verification email:', emailResult.error);
      // Don't fail the request, just log the error and continue
      console.log(`Email verification code for ${userData.email}: ${verificationCode}`);
    } else {
      console.log(`Email verification code sent to ${userData.email}: ${verificationCode}`);
    }

    res.json({
      message: 'Verification code sent successfully',
      // Remove this in production - only for demo purposes
      code: process.env.NODE_ENV === 'development' ? verificationCode : undefined
    });
  } catch (error) {
    console.error('Error sending email verification code:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Verify email with code
router.post('/verify-email', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ message: 'Verification code is required' });
    }

    // Get the verification code from the database
    const { data: codeData, error: codeError } = await supabase
      .from('verification_codes')
      .select('*')
      .eq('user_id', userId)
      .eq('type', 'email')
      .eq('code', code)
      .single();

    if (codeError || !codeData) {
      return res.status(400).json({ message: 'Invalid verification code' });
    }

    // Check if code is expired
    if (new Date(codeData.expires_at) < new Date()) {
      return res.status(400).json({ message: 'Verification code has expired' });
    }

    // Update user's email_verified status
    const { error: updateError } = await supabaseAdmin
      .from('users')
      .update({ email_verified: true, updated_at: new Date().toISOString() })
      .eq('id', userId);

    if (updateError) {
      console.error('Error updating email verification status:', updateError);
      return res.status(500).json({ message: 'Error updating verification status' });
    }

    // Delete the used verification code
    await supabaseAdmin
      .from('verification_codes')
      .delete()
      .match({ user_id: userId, type: 'email' });

    res.json({ message: 'Email verified successfully' });
  } catch (error) {
    console.error('Error verifying email:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Send phone verification code
router.post('/send-phone-code', auth, async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user phone
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('phone, phone_verified')
      .eq('id', userId)
      .single();

    if (userError) {
      console.error('Error fetching user phone:', userError);
      return res.status(500).json({ message: 'Error fetching user data' });
    }

    if (!userData.phone) {
      return res.status(400).json({ message: 'No phone number associated with this account' });
    }

    if (userData.phone_verified) {
      return res.status(400).json({ message: 'Phone is already verified' });
    }

    // Generate verification code (6 digits)
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Set expiration time (15 minutes from now)
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 15);

    // Delete any existing phone verification codes for this user
    await supabaseAdmin
      .from('verification_codes')
      .delete()
      .match({ user_id: userId, type: 'phone' });

    // Insert new verification code
    const { error: insertError } = await supabaseAdmin
      .from('verification_codes')
      .insert([{
        user_id: userId,
        code: verificationCode,
        type: 'phone',
        expires_at: expiresAt.toISOString(),
        created_at: new Date().toISOString()
      }]);

    if (insertError) {
      console.error('Error creating verification code:', insertError);
      return res.status(500).json({ message: 'Error creating verification code' });
    }

    // In a real application, you would send the code via SMS
    // For this demo, we'll just return it in the response
    console.log(`Phone verification code for ${userData.phone}: ${verificationCode}`);

    res.json({
      message: 'Verification code sent successfully',
      // Remove this in production - only for demo purposes
      code: verificationCode
    });
  } catch (error) {
    console.error('Error sending phone verification code:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Verify phone with code
router.post('/verify-phone', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ message: 'Verification code is required' });
    }

    // Get the verification code from the database
    const { data: codeData, error: codeError } = await supabase
      .from('verification_codes')
      .select('*')
      .eq('user_id', userId)
      .eq('type', 'phone')
      .eq('code', code)
      .single();

    if (codeError || !codeData) {
      return res.status(400).json({ message: 'Invalid verification code' });
    }

    // Check if code is expired
    if (new Date(codeData.expires_at) < new Date()) {
      return res.status(400).json({ message: 'Verification code has expired' });
    }

    // Update user's phone_verified status
    const { error: updateError } = await supabaseAdmin
      .from('users')
      .update({ phone_verified: true, updated_at: new Date().toISOString() })
      .eq('id', userId);

    if (updateError) {
      console.error('Error updating phone verification status:', updateError);
      return res.status(500).json({ message: 'Error updating verification status' });
    }

    // Delete the used verification code
    await supabaseAdmin
      .from('verification_codes')
      .delete()
      .match({ user_id: userId, type: 'phone' });

    res.json({ message: 'Phone verified successfully' });
  } catch (error) {
    console.error('Error verifying phone:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Submit identity verification
router.post('/submit-identity', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      documentType,
      documentNumber,
      documentExpiry,
      documentCountry,
      documentImageUrl,
      birthdate
    } = req.body;

    // Validate required fields
    if (!documentType || !documentNumber || !documentExpiry || !documentCountry || !documentImageUrl) {
      return res.status(400).json({ message: 'All identity document fields are required' });
    }

    // Validate document expiry date
    const expiryDate = new Date(documentExpiry);
    if (expiryDate < new Date()) {
      return res.status(400).json({ message: 'Document has expired' });
    }

    // Special handling for demo users
    if (req.user.isDemo) {
      console.log('Demo user detected, simulating identity verification');
      setTimeout(() => {
        console.log(`Demo identity verification completed for user ${userId}: Approved`);
      }, 3000);
      return res.json({
        message: 'Identity verification submitted successfully',
        status: 'in-progress',
        isDemo: true
      });
    }

    // Check if user already has a verification record
    const { data: existingVerification, error: checkError } = await supabase
      .from('user_verification')
      .select('id, verification_status')
      .eq('user_id', userId)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking existing verification:', checkError);
      return res.status(500).json({ message: 'Error checking verification status' });
    }

    // If verification exists and is already approved, don't allow changes
    if (existingVerification && existingVerification.verification_status === 'approved') {
      return res.status(400).json({ message: 'Identity is already verified' });
    }

    // Process document image
    try {
      const imageResponse = await axios.get(documentImageUrl, { responseType: 'arraybuffer' });
      const imageBuffer = Buffer.from(imageResponse.data, 'binary');
      
      // Validate image format and size
      const metadata = await sharp(imageBuffer).metadata();
      if (metadata.width < 800 || metadata.height < 600) {
        return res.status(400).json({ message: 'Document image resolution too low. Please upload a higher quality image.' });
      }
    } catch (error) {
      console.error('Error processing document image:', error);
      return res.status(400).json({ message: 'Invalid document image. Please upload a valid image file.' });
    }

    // Prepare verification data
    const verificationData = {
      identity_document_type: documentType,
      identity_document_number: documentNumber,
      identity_document_expiry: documentExpiry,
      identity_document_country: documentCountry,
      identity_document_url: documentImageUrl,
      verification_status: 'in-progress',
      updated_at: new Date().toISOString()
    };

    // Add birthdate if provided
    if (birthdate) {
      verificationData.birthdate = birthdate;
      const { error: userUpdateError } = await supabaseAdmin
        .from('users')
        .update({ birthdate, updated_at: new Date().toISOString() })
        .eq('id', userId);

      if (userUpdateError) {
        console.error('Error updating user birthdate:', userUpdateError);
      }
    }

    let updateResult;

    // Update or insert verification record
    if (existingVerification) {
      updateResult = await supabaseAdmin
        .from('user_verification')
        .update(verificationData)
        .eq('id', existingVerification.id);
    } else {
      verificationData.user_id = userId;
      verificationData.created_at = new Date().toISOString();
      updateResult = await supabaseAdmin
        .from('user_verification')
        .insert([verificationData]);
    }

    if (updateResult.error) {
      console.error('Error updating verification data:', updateResult.error);
      return res.status(500).json({ message: 'Error updating verification data' });
    }

    // Simulate AI verification process
    setTimeout(async () => {
      try {
        // 80% chance of success for demo purposes
        const isVerified = Math.random() < 0.8;

        const updateData = {
          identity_verified: isVerified,
          verification_status: isVerified ? 'approved' : 'rejected',
          verification_notes: isVerified
            ? 'Identity verified successfully'
            : 'Identity verification failed. Please try again with clearer documents.',
          updated_at: new Date().toISOString()
        };

        const { error: aiUpdateError } = await supabaseAdmin
          .from('user_verification')
          .update(updateData)
          .eq('user_id', userId);

        if (aiUpdateError) {
          console.error('Error updating AI verification result:', aiUpdateError);
        }

        console.log(`AI verification completed for user ${userId}: ${isVerified ? 'Approved' : 'Rejected'}`);
      } catch (aiError) {
        console.error('Error in AI verification process:', aiError);
      }
    }, 5000);

    res.json({
      message: 'Identity verification submitted successfully',
      status: 'in-progress'
    });
  } catch (error) {
    console.error('Error submitting identity verification:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Submit face verification
router.post('/submit-face', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { faceImageUrl, livenessFrames } = req.body;

    if (!faceImageUrl) {
      return res.status(400).json({ message: 'Face image URL is required' });
    }

    // Validate liveness frames
    if (!livenessFrames || !Array.isArray(livenessFrames) || livenessFrames.length < 3) {
      return res.status(400).json({ message: 'Liveness detection failed. Please try again.' });
    }

    // Special handling for demo users
    if (req.user.isDemo) {
      console.log('Demo user detected, simulating face verification');
      setTimeout(() => {
        console.log(`Demo face verification completed for user ${userId}: Approved`);
      }, 3000);
      return res.json({
        message: 'Face verification submitted successfully',
        status: 'in-progress',
        isDemo: true
      });
    }

    // Process face image
    try {
      const imageResponse = await axios.get(faceImageUrl, { responseType: 'arraybuffer' });
      const imageBuffer = Buffer.from(imageResponse.data, 'binary');
      
      // Validate image format and size
      const metadata = await sharp(imageBuffer).metadata();
      if (metadata.width < 800 || metadata.height < 800) {
        return res.status(400).json({ message: 'Face image resolution too low. Please upload a higher quality image.' });
      }
    } catch (error) {
      console.error('Error processing face image:', error);
      return res.status(400).json({ message: 'Invalid face image. Please upload a valid image file.' });
    }

    // Check if user already has a verification record
    const { data: existingVerification, error: checkError } = await supabase
      .from('user_verification')
      .select('id, verification_status, face_verified')
      .eq('user_id', userId)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking existing verification:', checkError);
      return res.status(500).json({ message: 'Error checking verification status' });
    }

    // If face is already verified, don't allow changes
    if (existingVerification && existingVerification.face_verified) {
      return res.status(400).json({ message: 'Face is already verified' });
    }

    // Prepare face verification data
    const faceData = {
      face_image_url: faceImageUrl,
      liveness_frames: livenessFrames,
      updated_at: new Date().toISOString()
    };

    let updateResult;

    // Update or insert verification record
    if (existingVerification) {
      updateResult = await supabaseAdmin
        .from('user_verification')
        .update(faceData)
        .eq('id', existingVerification.id);
    } else {
      faceData.user_id = userId;
      faceData.created_at = new Date().toISOString();
      faceData.verification_status = 'in-progress';
      updateResult = await supabaseAdmin
        .from('user_verification')
        .insert([faceData]);
    }

    if (updateResult.error) {
      console.error('Error updating face verification data:', updateResult.error);
      return res.status(500).json({ message: 'Error updating face verification data' });
    }

    // Simulate AI face verification process
    setTimeout(async () => {
      try {
        // 80% chance of success for demo purposes
        const isVerified = Math.random() < 0.8;

        const updateData = {
          face_verified: isVerified,
          verification_status: isVerified ? 'approved' : 'rejected',
          verification_notes: isVerified
            ? 'Face verified successfully'
            : 'Face verification failed. Please try again with a clearer photo.',
          updated_at: new Date().toISOString()
        };

        const { error: aiUpdateError } = await supabaseAdmin
          .from('user_verification')
          .update(updateData)
          .eq('user_id', userId);

        if (aiUpdateError) {
          console.error('Error updating AI face verification result:', aiUpdateError);
        }

        console.log(`AI face verification completed for user ${userId}: ${isVerified ? 'Approved' : 'Rejected'}`);
      } catch (aiError) {
        console.error('Error in AI face verification process:', aiError);
      }
    }, 3000);

    res.json({
      message: 'Face verification submitted successfully',
      status: 'in-progress'
    });
  } catch (error) {
    console.error('Error submitting face verification:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
