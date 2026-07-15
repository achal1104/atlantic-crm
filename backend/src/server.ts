// backend/src/server.ts
import 'dotenv/config';
import app from './app.js';

// Default to port 5000 for the backend API
const PORT = process.env.PORT || 5000;

const startServer = () => {
  try {
    app.listen(PORT, () => {
      console.log(`🚀 Backend Server is successfully running on http://localhost:${PORT}`);
      console.log(`👉 Health check: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error('❌ Failed to start the server:', error);
    process.exit(1);
  }
};

startServer();