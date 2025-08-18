import * as dotenv from 'dotenv';
import { defineConfig } from 'drizzle-kit';
dotenv.config({ path: '../.env' });

export default defineConfig({
	out: './src/drizzle',
	dialect: 'postgresql',
	schema: './src/schema.ts',
	dbCredentials: {
		url: process.env.DATABASE_URL!
	}
});
