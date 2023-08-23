
import { Config } from './config';

let config: Config;

export function loadConfig(): Config {
  if (!config) {
    // const server = require(`./config/server/config`);
    // config = { ...server.default };
    config = {
      host: '0.0.0.0',
      port: 3000,
      uploads: {
        imgDest: process.env.APP_DEIP_UPLOADS_IMGDEST as string,
        filesDest: process.env.APP_DEIP_UPLOADS_FILESDEST as string,
        videoDest: process.env.APP_DEIP_UPLOADS_VIDEODEST as string,
        azureAccount: process.env.APP_DEIP_UPLOADS_AZUREACCOUNT as string,
        azureKey: process.env.APP_DEIP_UPLOADS_AZUREKEY as string,
        azureConnection: process.env.APP_DEIP_UPLOADS_AZURECONNECTION as string,
      },
      publicUrl: process.env.APP_DEIP_PUBLIC_URL as string,
    };
  }

  return config;
}
