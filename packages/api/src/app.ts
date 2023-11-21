
import { ConnectOptions } from 'mongoose';

if (Boolean(process.env.APP_DEIP_APPLICATION_INSIGHTS_ACTIVE)) {
  const appInsights = require('applicationinsights');
  appInsights.setup(process.env.APP_DEIP_APPLICATION_INSIGHTS_KEY)
    .setAutoDependencyCorrelation(Boolean(process.env.APP_DEIP_APPLICATION_INSIGHTS_setAutoDependencyCorrelation))
    .setAutoCollectRequests(Boolean(process.env.APP_DEIP_APPLICATION_INSIGHTS_setAutoCollectRequests))
    .setAutoCollectPerformance(Boolean(process.env.APP_DEIP_APPLICATION_INSIGHTS_setAutoCollectPerformance))
    .setAutoCollectExceptions(Boolean(process.env.APP_DEIP_APPLICATION_INSIGHTS_setAutoCollectExceptions))
    .setAutoCollectDependencies(Boolean(process.env.APP_DEIP_APPLICATION_INSIGHTS_setAutoCollectDependencies))
    .setAutoCollectConsole(Boolean(process.env.APP_DEIP_APPLICATION_INSIGHTS_setAutoCollectConsole))
    .setUseDiskRetryCaching(Boolean(process.env.APP_DEIP_APPLICATION_INSIGHTS_setUseDiskRetryCaching));
  appInsights.start();
}

import * as express from 'express';
import * as cors from 'cors';
import * as session from 'express-session';
import * as bodyParser from 'body-parser';
import * as dotenv from 'dotenv';
import * as mongo from 'connect-mongo';
import * as mongoose from 'mongoose';
import * as expressValidator from 'express-validator';
import { loadConfig } from './config/loader';
import { errorHandler } from './error';
import { MemoryStore } from 'express-session';
import initializeAuth from './auth';
import RoutersFactory from './routes/';
import Uploads from './uploads';
import AzureStorage from './uploads/azure-storage';
import ValidatorFactory from './validator';
import registerWorkers from './workers';

const config = loadConfig();

const uploads = Uploads(loadConfig().uploads);
const azureStorage = new AzureStorage(config.uploads);
const validator = ValidatorFactory();

// Load environment variables from .env file, where API keys and passwords are configured
dotenv.config({ path: '.env' || '.env.example' });

// Create Express server
const app = express();

mongoose.set('strictQuery', true);
if (!Boolean(process.env.APP_DEIP_COSMOSDB)) {
  // Connect to MongoDB
  const mongoUrl = process.env.APP_DEIP_MONGODB_URI as string;
  const MongoStore = mongo(session);
  mongoose.connect(mongoUrl)
    .then(() => console.log('Connection to CosmosDB successful - development mode'))
    .catch((error) => console.error('MongoDB connection error. Please make sure MongoDB is running.', error));

  app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: process.env.APP_DEIP_SESSION_SECRET as string,
    store: new MongoStore({
      url: mongoUrl,
      autoReconnect: true
    }) as MemoryStore
  }));
} else {
  const mongoUri = `mongodb://${process.env.APP_DEIP_COSMOSDB_HOST}:${process.env.APP_DEIP_COSMOSDB_PORT}/${process.env.APP_DEIP_COSMOSDB_DBNAME}?ssl=true&retrywrites=false&replicaSet=globaldb`;
  mongoose.connect(mongoUri, <ConnectOptions>{
      user: process.env.APP_DEIP_COSMOSDB_USER,
      pass: process.env.APP_DEIP_COSMOSDB_PASSWORD
    })
    .then(() => console.log('Connection to CosmosDB successful'))
    .catch((error) => console.error('MongoDB connection error.', error));

  // Event listener
  mongoose.connection.on('error', (err) => {
    console.log('*Event Listener Error*', err);
  });
}

// Avoid -> DeprecationWarning: Mongoose: `findOneAndUpdate()` and `findOneAndDelete()`
// without the `useFindAndModify` option set to false are deprecated.
// See: https://mongoosejs.com/docs/deprecations.html#-findandmodify-
// mongoose.set('useFindAndModify', false);

// Express configuration
app.set('port', process.env.PORT || 3000);
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
// Cors use
app.use(cors());
app.use(RoutersFactory(
  {
    ...initializeAuth(),
    uploads,
    validator
  },
  {
    storage: azureStorage,
  }
));

app.use(errorHandler);

registerWorkers();

module.exports = app;
