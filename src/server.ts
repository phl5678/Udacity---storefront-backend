import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import userRoutes from './handlers/users';
import orderRoutes from './handlers/orders';
import productRoutes from './handlers/products';
import dashboardRoutes from './handlers/dashboard';

const app: express.Application = express();
const address = '0.0.0.0:3000';
const corsOptions = {
  origin: 'http://someotherdomain.com',
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

userRoutes(app);
orderRoutes(app);
productRoutes(app);
dashboardRoutes(app);

app.get('/', function (req: Request, res: Response) {
  res.send('Hello World!!');
});

app.listen(3000, function () {
  console.log(`starting app on: ${address}`);
});

export default app;
