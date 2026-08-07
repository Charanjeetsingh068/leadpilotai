import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import masterRouter from './routes';
import { errorMiddleware } from './middlewares/error.middleware';

export const createApp = (): Application => {
  const app = express();

  app.use(helmet({ crossOriginResourcePolicy: false }));
  app.use(cors({ origin: true, credentials: true }));
  app.options('*', cors({ origin: true, credentials: true }));
  app.use(morgan('dev'));
  app.use(
    express.json({
      verify: (req: any, _res, buf) => {
        req.rawBody = buf.toString('utf8');
      },
    })
  );
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  app.use('/api/v1', masterRouter);
  app.use('/api', masterRouter);
  app.use('/', masterRouter);

  app.use(errorMiddleware);

  return app;
};

