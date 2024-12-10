const swaggerJsDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Books Documentation',
      version: '1.0.0',
      description: 'API documentation for our application',
    },
    servers: [
      {
        url: 'http://localhost:8080/api/',
        description: 'Local development server',
      },
      {
        url: 'https://back-generateur-cv-grp1.onrender.com/api',
        description: 'Production server',
      },
    ],
  },
  apis: [
    './src/docs/schema/*.js', // Inclut tous les schémas
    './src/docs/path/*.js', // Inclut tous les endpoints
  ],
};

const swaggerSpec = swaggerJsDoc(options);

module.exports = swaggerSpec;
