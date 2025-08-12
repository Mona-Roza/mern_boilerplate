# **Backend**

## **Folder Structure**

```bash
/project-root
│
├── /src
│   ├── /config        # Application configurations
│   ├── /constants     # Application constants
│   ├── /controllers   # Handles incoming requests and sends responses
│   ├── /middlewares   # Custom Express middlewares (e.g., auth, error handler)
│   ├── /models        # Database models (e.g., Mongoose/Sequelize)
│   ├── /routes        # API route definitions
│   ├── /services      # Business logic layer
│   ├── /utils         # Helper and utility functions
│   └── app.js         # Express app initialization
│
├── /tests             # Unit and integration tests
│
├── .env               # Environment variables
├── .gitignore
├── package.json
└── server.js          # Entry point of the application
```

---

## **Environment Variables (`.env` file)**

```env
NODE_ENV=development
BASE_URL=http://localhost:8081
PORT=8081

JWT_SECRET=your_jwt_secret

# MongoDB credentials
DB_USERNAME=yourusername
DB_PASSWORD=strongpassword
DB_HOST=localhost
DB_PORT=27017
DB_NAME=trial
# Alternatively: DB_URI=mongodb://yourusername:strongpassword@localhost:27017/trial?authSource=admin

# Mailtrap (Email testing)
MAILTRAP_ENDPOINT=send.api.mailtrap.io
MAILTRAP_TOKEN=your_mailtrap_token

# Logging
LOG_LEVEL=info
```

---

## **Available Endpoints**

| Method | Endpoint                          | Description                     |
| ------ | --------------------------------- | ------------------------------- |
| POST   | `/api/auth/signin`                | Log in to the application       |
| POST   | `/api/auth/signup`                | Create a new account            |
| POST   | `/api/auth/verify-email`          | Verify email using a token/code |
| POST   | `/api/auth/forgot-password`       | Request a password reset link   |
| POST   | `/api/auth/reset-password/:token` | Reset password using token      |

---

## **Useful MongoDB Commands**

### **1. Run MongoDB in Docker**

```bash
docker run --name mymongo \\
  -p 27017:27017 \\
  -e MONGO_INITDB_ROOT_USERNAME=yourusername \\
  -e MONGO_INITDB_ROOT_PASSWORD=strongpassword \\
  -d mongo --auth
```

### **2. Open a Bash Shell in the Container**

```bash
docker exec -it mymongo bash
```

### **3. Connect to MongoDB**

```bash
mongosh -u yourusername -p strongpassword --authenticationDatabase admin
```

### **4. Show Databases & Collections in `mongosh`**

```javascript
show dbs
use yourDatabase
show collections
```

## **Running Application**

### **Production**

```bash
npm run start
```

### **Development**

```bash
npm run dev
```
