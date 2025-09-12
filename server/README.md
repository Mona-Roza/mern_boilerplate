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

## **API Documentation**

## Category API

**Base URL:** `/api/categories`

| Method | Endpoint             | Description                                           | Auth | Path Params | Request Body | Responses  |
| ------ | -------------------- | ----------------------------------------------------- | ---- | ----------- | ------------ | ---------- |
| GET    | `/`                  | Get all categories as a tree.                         | ❌   | –           | –            | 200 (tree) |
| GET    | `/search/name/:name` | Search categories by name (case-insensitive).         | ❌   | `name`      | –            | 200 (list) |
| GET    | `/flat`              | Get a flat list of categories (useful for dropdowns). | ❌   | –           | –            | 200 (list) |
| GET    | `/:id`               | Get category details by ID.                           | ❌   | `id`        | –            | 200, 404   |

## Admin Category Management API

**Base URL:** `/api/admin/categories`

| Method | Endpoint                     | Description                                              | Auth (Cookie JWT) | Path Params | Request Body Example                                                           | Responses             |
| ------ | ---------------------------- | -------------------------------------------------------- | ----------------- | ----------- | ------------------------------------------------------------------------------ | --------------------- |
| POST   | `/`                          | Create a root or child category (by parent name).        | ✅ Required       | –           | `{ "name": "Category", "parentName": "Parent" }`                               | 201, 400, 401/403     |
| POST   | `/parent/:parentId/children` | Create a child category by parent ID.                    | ✅ Required       | `parentId`  | `{ "name": "Child Category" }`                                                 | 201, 400/404, 401/403 |
| POST   | `/bulk`                      | Bulk create categories (optional parent by name).        | ✅ Required       | –           | `{ "categories": [ { "name": "Phones", "parentName": "Electronics" }, ... ] }` | 201, 400, 401/403     |
| PUT    | `/:id/name`                  | Update a category name by ID.                            | ✅ Required       | `id`        | `{ "newName": "New Category Name" }`                                           | 200, 400/404, 401/403 |
| PUT    | `/:id/parent`                | Update a category’s parent (set `null` to move to root). | ✅ Required       | `id`        | `{ "parentId": "66aa..." }` or `{ "parentId": null }`                          | 200, 400/404, 401/403 |
| PUT    | `/:id/status`                | Toggle a category’s active status.                       | ✅ Required       | `id`        | –                                                                              | 200, 404, 401/403     |
| DELETE | `/bulk`                      | Bulk delete categories by IDs.                           | ✅ Required       | –           | `{ "ids": ["66cf...", "66d0..."] }`                                            | 204, 400, 401/403     |
| DELETE | `/:id`                       | Delete category by ID.                                   | ✅ Required       | `id`        | –                                                                              | 204, 404, 401/403     |

## Admin User Management API

**Base URL:** `/api/admin/users`

| Method | Endpoint | Description       | Auth (Cookie JWT) | Path Params | Request Body Example                                                                                                                  | Responses             |
| ------ | -------- | ----------------- | ----------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------- | --------------------- |
| GET    | `/`      | Get all users     | ✅ admin only     | –           | –                                                                                                                                     | 200, 401/403          |
| GET    | `/:id`   | Get user by ID    | ✅ admin only     | `id`        | –                                                                                                                                     | 200, 404, 401/403     |
| PUT    | `/:id`   | Update user by ID | ✅ admin only     | `id`        | `{ "name": "new_name", "phone": "0512345678", "deliveryAddress": "new address", "role": "admin" \| "client", "accountStatus": true }` | 200, 400/404, 401/403 |
| DELETE | `/:id`   | Delete user by ID | ✅ admin only     | `id`        | –                                                                                                                                     | 204, 404, 401/403     |

## User Self Management API

**Base URL:** `/api/users`

| Method | Endpoint                 | Description                                     | Auth (Cookie JWT) | Path Params | Request Body Example                                                               | Responses             |
| ------ | ------------------------ | ----------------------------------------------- | ----------------- | ----------- | ---------------------------------------------------------------------------------- | --------------------- |
| GET    | `/me/:id`                | Get own user profile by ID                      | ✅ required       | `id`        | –                                                                                  | 200, 401/403          |
| PUT    | `/me/:id`                | Update own profile info                         | ✅ required       | `id`        | `{ "name": "John Doe", "phone": "0512345678", "deliveryAddress": "Some Address" }` | 200, 400/404, 401/403 |
| PUT    | `/me/:id/email`          | Update own email                                | ✅ required       | `id`        | `{ "email": "newmail@example.com" }`                                               | 200, 400/404, 401/403 |
| PUT    | `/me/:id/password`       | Update own password                             | ✅ required       | `id`        | `{ "currentPassword": "oldpass", "newPassword": "newpass" }`                       | 200, 400/404, 401/403 |
| PUT    | `/me/:id/account-status` | Update own account status (activate/deactivate) | ✅ required       | `id`        | `{ "accountStatus": true }`                                                        | 200, 400/404, 401/403 |

## Admin Product Management API

**Base URL:** `/api/admin/products`

| Method | Endpoint | Description          | Auth (Cookie JWT) | Path Params | Request Body Example                                                                                                                                                           | Responses             |
| ------ | -------- | -------------------- | ----------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------- |
| POST   | `/`      | Create a new product | ✅ admin only     | –           | `{ "name": "Phone X", "description": "Latest model", "price": "999.99", "categories": ["66cf...","66d0..."], "images": [file1, file2] }` (multipart/form-data with `images[]`) | 201, 400, 401/403     |
| PUT    | `/:id`   | Update product by ID | ✅ admin only     | `id`        | `{ "name": "Phone X Updated", "description": "Updated description", "price": "899.99", "categories": ["66cf..."], "images": [file1] }` (multipart/form-data with `images[]`)   | 200, 400/404, 401/403 |
| DELETE | `/:id`   | Delete product by ID | ✅ admin only     | `id`        | –                                                                                                                                                                              | 204, 404, 401/403     |

## User Product API

**Base URL:** `/api/products`

| Method | Endpoint | Description               | Auth | Path Params | Request Body | Responses |
| ------ | -------- | ------------------------- | ---- | ----------- | ------------ | --------- |
| GET    | `/`      | Get all products (list)   | ❌   | –           | –            | 200       |
| GET    | `/:id`   | Get product details by ID | ❌   | `id`        | –            | 200, 404  |
