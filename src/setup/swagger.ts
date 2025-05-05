import { type Express } from "express";
import swaggerUi from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "API моего сервера",
            version: "1.0.0",
        },
        servers: [
            {
                url: "http://localhost:3000",
            },
        ],
        components: {
            schemas: {
                User: {
                    type: "object",
                    properties: {
                        _id: {
                            type: "string",
                            description: "Автоматически сгенерированный ID пользователя",
                            example: "60d0fe4f5311236168a109ca"
                        },
                        name: {
                            type: "string",
                            description: "Имя пользователя",
                            example: "Иван Иванов"
                        },
                        email: {
                            type: "string",
                            description: "Email пользователя",
                            example: "ivan.ivanov@example.com"
                        }
                    },
                    required: ["name", "email"]
                }
            }
        },
    },
    apis: ["./src/routes/*.ts"],
};

export default function setupSwagger(app: Express) {
    const swaggerSpec = swaggerJsDoc(options);
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
