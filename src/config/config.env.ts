/* eslint-disable prettier/prettier */
import * as dotenv from 'dotenv';
dotenv.config();

export interface IEnvironment {
  MAILER: {
    SMTP: string;
    HOST: string;
    PORT: number;
    EMAIL: string;
    PASSWORD: string;
  };
  DB: {
    HOST: string;
    PORT: number;
    USERNAME: string;
    NAME: string;
    PASSWORD: string;
  };  
  OAUTH: {
    GOOGLE_OAUTH_CLIENT_ID: string;
  };
  STORAGE: {
    BACKBLAZE_STORAGE_BUCKET: string;
    BACKBLAZE_STORAGE_APP_KEY: string;
    BACKBLAZE_STORAGE_BUCKET_ID: string;
    BACKBLAZE_STORAGE_APP_KEY_ID: string;
    BACKBLAZE_STORAGE_BUCKET_ENDPOINT: string;
    BUNNY_ACCESS_KEY: string;
  };
  SECRETS:{
    JWT_SECRET:string
  },
  PAYSTACK:{
    PAYSTACK_SECRET:string
  }
}

export const ENVIRONMENT: IEnvironment = {
  MAILER: {
    SMTP: process.env.MAILER_SMTP ?? "",
    HOST: process.env.MAILER_HOST ?? "",
    PORT: process.env.MAILER_PORT ? +process.env.MAILER_PORT:587,
    EMAIL: process.env.MAILER_EMAIL ?? "",
    PASSWORD: process.env.MAILER_PASSWORD ?? "",
  },
  DB: {
    HOST: process.env.DB_HOST ?? "",
    PORT: process.env.DB_PORT ? +process.env.DB_PORT:41168,
    USERNAME: process.env.DB_USERNAME ?? "",
    PASSWORD: process.env.DB_PASSWORD ?? "",
    NAME: process.env.DB_NAME ?? "",
  },
  SECRETS:{
    JWT_SECRET:process.env.JWT_SECRET ?? ""
  },
  PAYSTACK:{
    PAYSTACK_SECRET:process.env.PAYSTACK_SECRET ?? ""
  },
  STORAGE:{
    BACKBLAZE_STORAGE_BUCKET:process.env.BACKBLAZE_STORAGE_BUCKET ?? "",
    BACKBLAZE_STORAGE_APP_KEY:process.env.BACKBLAZE_STORAGE_APP_KEY ?? "",
    BACKBLAZE_STORAGE_BUCKET_ID:process.env.BACKBLAZE_STORAGE_BUCKET_ID ?? "",
    BACKBLAZE_STORAGE_APP_KEY_ID:process.env.BACKBLAZE_STORAGE_APP_KEY_ID ?? "",
    BACKBLAZE_STORAGE_BUCKET_ENDPOINT:process.env.BACKBLAZE_STORAGE_BUCKET_ENDPOINT ?? "",
    BUNNY_ACCESS_KEY:process.env.BUNNY_ACCESS_KEY ?? ""
  },
  OAUTH:{
    GOOGLE_OAUTH_CLIENT_ID:process.env.GOOGLE_OAUTH_CLIENT_ID ?? ""
  }

};