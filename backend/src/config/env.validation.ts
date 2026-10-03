export interface EnvironmentVariables {
  NODE_ENV: 'development' | 'production' | 'test';
  PORT: number;
  DATABASE_URL: string;
  CORS_ORIGINS: string;
}

export function validateEnvironment(config: Record<string, unknown>): EnvironmentVariables {
  const errors: string[] = [];

  const validEnvironments = ['development', 'production', 'test'] as const;
  const nodeEnv = config.NODE_ENV;
  if (!nodeEnv || typeof nodeEnv !== 'string' || !validEnvironments.includes(nodeEnv as (typeof validEnvironments)[number])) {
    errors.push(`NODE_ENV must be one of: ${validEnvironments.join(', ')} (received "${String(nodeEnv)}")`);
  }

  const portVal = config.PORT;
  const port = Number(portVal);
  if (
    portVal === undefined ||
    portVal === null ||
    portVal === '' ||
    Number.isNaN(port) ||
    !Number.isInteger(port) ||
    port < 1 ||
    port > 65535
  ) {
    errors.push(`PORT must be a valid integer between 1 and 65535 (received "${String(portVal)}")`);
  }

  const databaseUrl = config.DATABASE_URL;
  if (!databaseUrl || typeof databaseUrl !== 'string' || databaseUrl.trim() === '') {
    errors.push('DATABASE_URL is required and must be a non-empty string');
  }

  const corsOrigins = config.CORS_ORIGINS;
  if (!corsOrigins || typeof corsOrigins !== 'string' || corsOrigins.trim() === '') {
    errors.push('CORS_ORIGINS is required and must be a non-empty string (comma-separated origins)');
  }

  if (errors.length > 0) {
    throw new Error(
      `Environment configuration validation failed:\n${errors.map((e) => `  - ${e}`).join('\n')}`,
    );
  }

  return {
    NODE_ENV: nodeEnv as (typeof validEnvironments)[number],
    PORT: port,
    DATABASE_URL: databaseUrl as string,
    CORS_ORIGINS: corsOrigins as string,
  };
}
