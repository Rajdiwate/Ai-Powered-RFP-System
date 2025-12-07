import { Router } from 'express';

const appRoutes = Router();

appRoutes.get('/api', (req, res) => {
  res.send('Hello World!');
});

export { appRoutes };
