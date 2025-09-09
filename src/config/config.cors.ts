import {
  CorsOptions,
  CustomOrigin,
} from '@nestjs/common/interfaces/external/cors-options.interface';

const CORS_WHITELIST = ['https://smartivhauz.com'];

const validateCors: CustomOrigin = (origin, callback) => {
  // Allow requests with no origin (e.g., Postman, server-to-server)
  if (!origin) return callback(null, true);

  // Allow localhost during development
  if (origin.includes('localhost')) return callback(null, true);

  // Allow origins in the whitelist
  if (CORS_WHITELIST.includes(origin)) return callback(null, true);

  // Reject any other origins
  return callback(new Error(`Origin ${origin} is not allowed by CORS`));
};

export const corsOptions: CorsOptions = {
  origin: validateCors,
  credentials: true, // allow cookies or auth headers
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'], // explicitly allowed methods
};
