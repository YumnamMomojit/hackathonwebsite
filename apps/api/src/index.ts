import express from 'express';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

import authRoutes from './routes/auth';
import hackathonRoutes from './routes/hackathon';

app.use('/api/auth', authRoutes);
app.use('/api/hackathons', hackathonRoutes);

app.get('/api', (req, res) => {
  res.send('Hello from the API!');
});

app.listen(port, () => {
  console.log(`API server listening at http://localhost:${port}`);
});
