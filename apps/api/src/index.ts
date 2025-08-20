import express from 'express';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

import authRoutes from './routes/auth';
import hackathonRoutes from './routes/hackathon';
import projectRoutes from './routes/project';
import userRoutes from './routes/user';

app.use('/api/auth', authRoutes);
app.use('/api/hackathons', hackathonRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/users', userRoutes);

app.get('/api', (req, res) => {
  res.send('Hello from the API!');
});

app.listen(port, () => {
  console.log(`API server listening at http://localhost:${port}`);
});
