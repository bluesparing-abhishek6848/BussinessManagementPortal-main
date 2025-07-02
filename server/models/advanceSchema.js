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
  date:{
    type: Date,
    // default: Date.now,
    required: true, // Ensure date is provided


  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },  
}, {
  timestamps: true,

}); 

const Advance = mongoose.model('Advance', advanceSchema);
export default Advance;