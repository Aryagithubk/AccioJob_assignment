// sessionController.js
const Session = require('../models/Session');

// Create a new session with empty chatHistory
exports.createSession = async (req, res) => {
  try {
    const session = await Session.create({
      user: req.user._id,
      title: req.body.title || 'Untitled', // Will be updated later from first prompt
      chatHistory: [],
      uiState: {} // Optional, for storing persistent UI preferences
    });
    res.status(201).json(session);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all sessions for the logged-in user, sorted by recent
exports.getAllSessions = async (req, res) => {
  try {
    const sessions = await Session.find({ user: req.user._id }).sort({ updatedAt: -1 });
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get a specific session by ID
exports.getSessionById = async (req, res) => {
  try {
    const session = await Session.findOne({ _id: req.params.id, user: req.user._id });
    if (!session) return res.status(404).json({ message: 'Session not found' });
    res.json(session);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update session (e.g., title or UI state)
exports.updateSession = async (req, res) => {
  try {
    const session = await Session.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { ...req.body },
      { new: true }
    );
    if (!session) return res.status(404).json({ message: 'Session not found' });
    res.json(session);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete session
exports.deleteSession = async (req, res) => {
  try {
    const session = await Session.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!session) return res.status(404).json({ message: 'Session not found' });
    res.json({ message: 'Session deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
