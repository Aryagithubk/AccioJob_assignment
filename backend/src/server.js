// server.js
const app = require('./app');
const connectDB = require('./config/db');
// const redis = require('./config/redis');
const dotenv = require('dotenv');
dotenv.config({ path: '../.env' });

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await connectDB(); // MongoDB connection
    console.log('Starting server...');
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  } catch (err) {
    console.error('Server startup error:', err);
    process.exit(1);
  }
})();
