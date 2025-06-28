import mongoose from 'mongoose';

const advanceSchema = new mongoose.Schema({
  advanceAmount: {
    type: Number,
    required: true,
  },
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'approved',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,

}); 

const Advance = mongoose.model('Advance', advanceSchema);
export default Advance;