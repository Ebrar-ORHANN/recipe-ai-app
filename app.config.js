import 'dotenv/config'; // dotenv otomatik .env yükler

export default ({ config }) => {
  return {
    ...config,
    extra: {
      GEMINI_API_KEY: process.env.GEMINI_API_KEY || ''
    },
  };
};
