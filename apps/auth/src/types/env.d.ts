export interface EnvironmentVariables {
  MONGO_USERNAME: string;
  MONGO_PASSWORD: string;
  MONGO_DATABASE: string;
  MONGO_HOST?: string;
  AUTH_SERVICE_HOST?: string;
  JWT_SECRET_KEY: string;
  SECRET_KEY: string;
  SECRET_SALT: string;
}
