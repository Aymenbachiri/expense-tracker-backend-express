import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import HomeRoute from '../src/routes/home';
import { PORT } from './config/config';
import { rateLimiter } from './lib/utils/rate-limiter';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(rateLimiter);

(async () => {
  try {
    app.use('/api', HomeRoute);

    app.listen(PORT, () => {
      console.log(`Server is running http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Server error', error);
  }
})();
