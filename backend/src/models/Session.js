// // Session.js
// const mongoose = require('mongoose');

// const sessionSchema = new mongoose.Schema(
//   {
//     user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//     title: { type: String, default: 'Untitled' },
//     chatHistory: [{ role: String, content: String }], // { role: 'user' | 'ai', content: '...' }
//     code: {
//       jsx: { type: String, default: '' },
//       css: { type: String, default: '' }
//     },
//     uiState: {
//       type: mongoose.Schema.Types.Mixed // for editable position/state of elements
//     }
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model('Session', sessionSchema);


const mongoose = require('mongoose');

const chatSetSchema = new mongoose.Schema({
  userPrompt: {
    type: String,
    required: false // changed to false to allow initial empty chatHistory
  },
  aiResponse: {
    type: String,
    required: false // changed to false to allow initial empty chatHistory
  },
  code: {
    jsx: {
      type: String,
      default: ''
    },
    css: {
      type: String,
      default: ''
    }
  }
}, { _id: false });

const sessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    title: {
      type: String,
      default: 'Untitled'
    },
    chatHistory: {
      type: [chatSetSchema],
      default: [] // ensure it's an empty array on creation
    },
    uiState: {
      type: mongoose.Schema.Types.Mixed
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Session', sessionSchema);
