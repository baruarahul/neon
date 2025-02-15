const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Neon Signage API",
      description: "API documentation for Neon Signage Backend",
      version: "1.0.0",
    },
    servers: [{ url: "http://localhost:5000/api" }],
  },
  apis: ["./src/routes/*.js"], // Loads Swagger docs from all route files
};

const swaggerSpec = swaggerJSDoc(options);

const setupSwagger = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

module.exports = setupSwagger;
