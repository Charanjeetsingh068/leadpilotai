import dotenv from 'dotenv';
dotenv.config();

export const ENV = {
  PORT: Number(process.env.PORT) || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/leadpilot',
  JWT_SECRET: process.env.JWT_SECRET || 'supersecretkey_leadpilot',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'supersecretrefreshkey_leadpilot',
  REDIS_HOST: process.env.REDIS_HOST || 'localhost',
  REDIS_PORT: Number(process.env.REDIS_PORT) || 6379,
  FACEBOOK_APP_ID: process.env.FACEBOOK_APP_ID || '1712255293083461',
  FACEBOOK_APP_SECRET: process.env.FACEBOOK_APP_SECRET || 'fadc1ae30941d9573ec85c9fe27dc784',
  FACEBOOK_BUSINESS_ID: process.env.FACEBOOK_BUSINESS_ID || '312449849278509',
  FACEBOOK_CONFIG_ID: process.env.FACEBOOK_CONFIG_ID || '937320012719440',
  META_LOGIN_CONFIG_ID: process.env.META_LOGIN_CONFIG_ID || process.env.FACEBOOK_CONFIG_ID || '937320012719440',
  FACEBOOK_VERIFY_TOKEN: process.env.FACEBOOK_VERIFY_TOKEN || 'leadpilot_fb_secret_token_98765',
  META_GRAPH_API_VERSION: process.env.META_GRAPH_API_VERSION || 'v23.0',
  ENCRYPTION_KEY: process.env.ENCRYPTION_KEY || 'leadpilot_super_secret_encryption_key_32bytes!!',
  FRONTEND_URL: process.env.FRONTEND_URL || process.env.APP_URL || 'https://leadpilotai-rust.vercel.app',
  FACEBOOK_REDIRECT_URI: process.env.FACEBOOK_REDIRECT_URI || 'https://leadpilotai-2kar.onrender.com/api/integrations/facebook/callback',
} as const;
