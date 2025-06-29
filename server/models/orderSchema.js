import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
 itemName: {
    type: String,
    required: true,
    trim: true
  },
  itemImage: {
    type: String,
    trim: true
  },
itemDescription: {
    type: String,
    required: true,
    trim: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  amountRecieved: {
    type: Number,
    min: 0
  },
  expenseCost:{
  type: Number,
    min: 0
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['recieved', 'making', 'completed', 'pending'],
    default: 'recieved'
  }, 
  createdAt: {
    type: Date,
    default: Date.now
  }
  ,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
}, {
  timestamps: true
});
const Order = mongoose.model('Order', orderSchema);
export default Order;
