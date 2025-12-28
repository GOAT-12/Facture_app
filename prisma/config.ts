import { defineDatasource } from './node_modules/@prisma/client/runtime/library';

export default defineDatasource({
    schema: './schema.prisma',
    datasources: {
        db: {
            url: process.env.DATABASE_URL,
        },
    },
});
