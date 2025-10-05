
```
# 📦 Inventory Management System (IMS) — Backend

This is a backend API built with **Node.js + Express + MongoDB** for managing users and products.
It includes authentication, product CRUD operations, stock management, password reset via email, and **image storage using Cloudinary**.

---

## 🛠 Tech Stack

* **Node.js / Express** — backend framework
* **MongoDB (Mongoose)** — database
* **JWT** — authentication
* **Cloudinary** — image storage & hosting
* **Multer + multer-storage-cloudinary** — file uploads
* **Nodemailer** — email (for password reset)
* **dotenv** — environment variables
* **CORS** — cross-origin support

---

## 📂 Project Structure

```

IMS/
└── backend/
├── server.js                \# App entry point
├── .env                     \# Env variables (not committed to git)
├── src/
│   ├── config/db.js         \# MongoDB connection
│   ├── routes/
│   │   ├── userRoutes.js    \# User auth routes
│   │   └── productRoutes.js \# Product routes
│   ├── controllers/         \# Controller logic
│   ├── middleware/
│   │   └── uploadimage.js   \# Cloudinary upload config
│   └── utils/               \# helper files if any
├── package.json

````

---

## ⚙️ Setup & Run

1. Clone the repo and install dependencies:

   ```bash
   git clone <repo-url>
   cd IMS/backend
   npm install
````

2.  Create a `.env` file in `/backend` with variables for:

      * `PORT`
      * `MONGO_URI`
      * `JWT_SECRET_KEY`
      * `MY_GMAIL` and `MY_PASSWORD` (for email service)
      * `CLIENT_URL`
      * `CLOUD_NAME`, `API_KEY`, `API_SECRET` (for Cloudinary)

    *(Exact values should remain private.)*

3.  Run the server:

    ```bash
    npm run dev   # development with nodemon
    npm start     # production
    ```

Server runs at: **[http://localhost:4000](https://www.google.com/search?q=http://localhost:4000)**

-----

## 🔐 User Routes (`/users`)

| Method | Endpoint                       | Description               |
| ------ | ------------------------------ | ------------------------- |
| `POST` | `/users/signup`                | Register a new user       |
| `POST` | `/users/login`                 | Login & get JWT token     |
| `POST` | `/users/forgot-password`       | Send reset link via email |
| `POST` | `/users/reset-password/:token` | Reset password            |

-----

## 📦 Product Routes (`/products`)

| Method   | Endpoint                       | Middleware               | Description                                           |
| -------- | ------------------------------ | ------------------------ | ----------------------------------------------------- |
| `POST`   | `/products/`                   | `upload.single('image')` | Create new product (image stored on Cloudinary)       |
| `GET`    | `/products/`                   | –                        | Get all products                                      |
| `PUT`    | `/products/:id`                | `upload.single('image')` | Update product (image optional, stored on Cloudinary) |
| `DELETE` | `/products/:id`                | –                        | Delete product                                        |
| `POST`   | `/products/:id/increase-stock` | –                        | Increase product stock                                |
| `POST`   | `/products/:id/decrease-stock` | –                        | Decrease product stock                                |
| `GET`    | `/products/low-stock`          | –                        | Fetch low-stock products                              |

-----

## 🖼️ Image Uploads with Cloudinary

  * Images are uploaded through `multer` configured with `multer-storage-cloudinary`.
  * When a product is created or updated, the image is **stored in Cloudinary** and the image URL is saved in the database.
  * This ensures scalability, fast loading, and secure cloud storage instead of local file system.

-----

## ✉️ Password Reset with Email

  * The app uses **Nodemailer** with Gmail service.
  * When a user requests password reset, an email is sent with a reset link.
  * The user can reset their password using the token-based endpoint.

-----

## ✅ Features

  * Secure user authentication with JWT
  * Product CRUD with Cloudinary image uploads
  * Increase / decrease stock operations
  * Low stock detection
  * Password reset via email
  * Modular code with controllers, routes, middleware

-----

## 👩‍💻 Author

Developed by **Sakshi Shinde**

```
