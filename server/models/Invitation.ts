import mongoose from 'mongoose';

const invitationSchema = new mongoose.Schema({
  email: { type: String, required: true, lowercase: true },
  invitedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
  token: { type: String, required: true, unique: true },
  status: { type: String, enum: ['pending', 'accepted'], default: 'pending' },
  expiresAt: { type: Date, required: true }
}, { timestamps: true });

export default mongoose.model('Invitation', invitationSchema);
