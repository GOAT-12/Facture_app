const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

exports.handler = async (event, context) => {
    // Gérer les requêtes OPTIONS pour le CORS
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            },
            body: '',
        };
    }

    // Gérer les requêtes API
    const path = event.path.replace(/\.netlify\/functions\/server\/?/, '');
    let statusCode = 200;
    let body;

    try {
        console.log('Path:', path);
        console.log('Method:', event.httpMethod);

        switch (path) {
            case '':
            case '/':
                if (event.httpMethod === 'GET') {
                    body = JSON.stringify({ message: 'API is working' });
                } else {
                    statusCode = 405;
                    body = JSON.stringify({ error: 'Method not allowed' });
                }
                break;

            case 'invoices':
                if (event.httpMethod === 'GET') {
                    const invoices = await prisma.invoice.findMany({
                        include: { lines: true }
                    });
                    body = JSON.stringify(invoices);
                } else {
                    statusCode = 405;
                    body = JSON.stringify({ error: 'Method not allowed' });
                }
                break;

            default:
                statusCode = 404;
                body = JSON.stringify({ error: 'Not found', path });
        }
    } catch (error) {
        console.error('Error:', error);
        statusCode = 500;
        body = JSON.stringify({
            error: 'Internal server error',
            details: error.message
        });
    }

    return {
        statusCode,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        },
        body,
    };
};

// Gestion de la connexion à la base de données
process.on('beforeExit', async () => {
    await prisma.$disconnect();
});
