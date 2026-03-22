import { defineConfig } from '@prisma/config';

export default defineConfig({
    schema: 'prisma/schema.prisma',
    datasource: {
        // This is where the CLI and the Client get their connection string
        url: process.env.DATABASE_URL!,
    },
});