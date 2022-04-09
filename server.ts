import express  from 'express'
import cors from 'cors'
import { IModels } from './create_models';
import { createRoutes } from './routes';

export const app = express();
app.use(express.json());
app.use(cors());


// Catches errors thrown from async functions
export const asyncHandler: any = (fn: any) => (req: any, res: any, next: any) => {
  return Promise
      .resolve(fn(req, res, next))
      .catch(next);
};

app.use(asyncHandler(async(req: any, res: any, next: any) => {
  next();
}));


const port = 9000;

export function startServer(models: IModels){
  createRoutes(app, models);

  // Error Handler
  app.use(function (err: any, req: any, res: any, next: any) {
    console.error(err)
    res.status(500).send({error: err.message})
  });

  app.listen(port, () => {
    console.log(`Crypto backend listening on port ${port}`)
  });
}