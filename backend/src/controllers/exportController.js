const Session = require('../models/Session');
const { generateZipBuffer } = require('../services/zipService');

exports.exportSession = async (req, res) => {
  try {
    const session = await Session.findOne({ _id: req.params.id, user: req.user._id });
    console.log("param id : ", req.params.id)
    console.log("user id : ", req.user._id)

    if (!session) return res.status(404).json({ message: 'Session not found' });

    // Get the latest code from the last chatHistory entry
    let jsx = '';
    let css = '';
    if (session.chatHistory && session.chatHistory.length > 0) {
      const last = session.chatHistory[session.chatHistory.length - 1];
      jsx = last.code?.jsx || '';
      css = last.code?.css || '';
    }

    const buffer = await generateZipBuffer(jsx, css, session.title);
    res.set({
      'Content-Disposition': `attachment; filename="${session.title}.zip"`,
      'Content-Type': 'application/zip'
    });
    res.send(buffer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};