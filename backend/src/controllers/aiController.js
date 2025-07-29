// // aiController.js
// const { generateComponent, updateComponent } = require('../services/aiService');
// const Session = require('../models/Session');

// exports.generate = async (req, res) => {
//   const { prompt } = req.body;
//   try {
//     const { jsx, css, chatReply } = await generateComponent(prompt);
//     res.json({ jsx, css, chatReply });
//   } catch (err) {
//     res.status(500).json({ message: 'AI generation failed', error: err.message });
//   }
// };

// exports.patchComponent = async (req, res) => {
//   const { prompt, jsx, css } = req.body;
//   try {
//     const { newJsx, newCss, chatReply } = await updateComponent(prompt, jsx, css);
//     res.json({ jsx: newJsx, css: newCss, chatReply });
//   } catch (err) {
//     res.status(500).json({ message: 'AI refinement failed', error: err.message });
//   }
// };


const Session = require('../models/Session');
const { generateComponent, updateComponent } = require('../services/aiService');

exports.generate = async (req, res) => {
  const { prompt, sessionId } = req.body;
  try {
    const { jsx, css, chatReply } = await generateComponent(prompt);

    const session = await Session.findOne({ _id: sessionId, user: req.user._id });
    if (!session) return res.status(404).json({ message: 'Session not found' });

    // Only set title once
    if (session.title === 'Untitled') {
      session.title = prompt.length > 15 ? `${prompt.slice(0, 15)}...` : prompt;
    }

    session.chatHistory.push({
      userPrompt: prompt,
      aiResponse: chatReply,
      code: { jsx, css }
    });

    await session.save();
    res.json({ jsx, css, chatReply });
  } catch (err) {
    res.status(500).json({ message: 'AI generation failed', error: err.message });
  }
};

exports.patchComponent = async (req, res) => {
  const { prompt, jsx, css, sessionId } = req.body;
  try {
    const { newJsx, newCss, chatReply } = await updateComponent(prompt, jsx, css);

    const session = await Session.findOne({ _id: sessionId, user: req.user._id });
    if (!session) return res.status(404).json({ message: 'Session not found' });

    session.chatHistory.push({
      userPrompt: prompt,
      aiResponse: chatReply,
      code: { jsx: newJsx, css: newCss }
    });

    await session.save();
    res.json({ jsx: newJsx, css: newCss, chatReply });
  } catch (err) {
    res.status(500).json({ message: 'AI refinement failed', error: err.message });
  }
};
