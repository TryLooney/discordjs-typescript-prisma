declare global {
  namespace NodeJS {
    interface ProcessEnv {
      BOT_TOKEN: string;
      ENVIRONMENT: 'dev' | 'prod' | 'debug';
      DATABASE_URL: string;
    }
  }
}

export {};
