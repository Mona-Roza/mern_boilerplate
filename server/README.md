# BackEnd

## Folder Structure

```bash
/project-root
│
├── /src
│ ├── /config # Application configurations
│ ├── /controllers # Handles incoming requests and sends responses
│ ├── /routes # API route definitions
│ ├── /services # Business logic layer
│ ├── /models # Database models (e.g. Mongoose/Sequelize)
│ ├── /middlewares # Custom Express middlewares (e.g. auth, error handler)
│ ├── /utils # Helper and utility functions
│ └── app.js # Express app initialization
│
├── /tests # Unit and integration tests
│
├── .env # Environment variables
├── .gitignore
├── package.json
└── server.js # Entry point of the application
```
