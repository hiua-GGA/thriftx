const concurrently = require('concurrently');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

const { result } = concurrently([
  {
    command: 'cd client && npm run dev',
    name: 'FRONTEND',
    prefixColor: 'blue',
  },
  {
    command: 'cd server && npm run dev',
    name: 'BACKEND',
    prefixColor: 'magenta',
  },
], {
  prefix: 'name',
  timestampFormat: 'HH:mm:ss',
  restartTries: 3,
  restartDelay: 1000,
});

result.then(
  () => {
    console.log('All processes exited successfully');
    process.exit(0);
  },
  (err) => {
    console.error('Error occurred:', err);
    process.exit(1);
  }
); 