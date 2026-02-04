# 🛍️ MeeshoClone — Full Stack E-Commerce Application

## 📌 Project Overview

**MeeshoClone** is a full-stack e-commerce marketplace application inspired by the Indian platform **Meesho**.  
I built this project to replicate a real-world full-stack architecture where both sellers and customers have separate roles and functionalities.

The platform allows:

- Sellers to list products and manage orders  
- Customers to browse products, manage their cart, and place orders  

This project focuses on building a scalable marketplace system similar to Meesho.

---

## ⚙️ Tech Stack

### Backend
- Python  
- Django  
- Django REST Framework (DRF)  
- PostgreSQL  

### Frontend
- React.js (Single Page Application)  
- Tailwind CSS  

### Additional Services & Tools
- Celery + Redis → Background tasks & caching  
- WeasyPrint → PDF invoice generation  
- Mailtrap → Email testing service  
- Razorpay (Test Mode) → Payment gateway integration  

The repository mainly contains:

- JavaScript (~61%) → React frontend  
- Python (~37%) → Django backend  

---

## ✨ Key Features

This application includes all major e-commerce functionalities:

---

## 👤 Authentication & Roles

- User registration and login  
- Two separate roles:  
  - Customer  
  - Seller  
- Role-based access control is applied so sellers and customers only see what they are allowed to.

---

## 🛒 Customer Features

- Browse products by category  
- View product details  
- Add/remove items from cart  
- Checkout and place orders  
- Receive confirmation emails  
- Get PDF invoices after ordering  

---

## 🏪 Seller Features

- Add new products  
- Edit or delete existing products  
- View incoming customer orders  
- Manage their product listings  

---

## 📦 Order & Invoice System

When a customer completes checkout:

1. An order is created in the database  
2. Payment is processed through Razorpay (test mode)  
3. Confirmation email is sent  
4. PDF invoice is generated asynchronously  

Celery and Redis handle invoice generation and email sending in the background for better performance.

---

## 📂 Project Structure

The repository is divided into two main parts:

```bash
MeeshoClone/
│
├── Backend/     # Django + DRF server
│   ├── users/
│   ├── products/
│   ├── carts/
│   ├── orders/
│   ├── payments/
│   └── ...
│
├── Frontend/    # React + Tailwind client
│   ├── src/
│   ├── components/
│   ├── pages/
│   └── services/
│
└── README.md
```

---

## 🌍 Live Deployment

The project is deployed online and accessible here:

🔗 https://meesho-clone-pink.vercel.app

---

## 🚀 Getting Started (Local Setup)

Follow these steps to run the project locally.

---

### 🔽 Clone the Repository

```bash
git clone https://github.com/rahulkumarparida/MeeshoClone.git
cd MeeshoClone
```

---

## 🖥️ Backend Setup

### 1. Install Dependencies

Create a virtual environment and install requirements:

```bash
pip install -r Backend/requirements.txt
```

### 2. Configure PostgreSQL Database

Set up a PostgreSQL database and update the credentials inside `settings.py`.

### 3. Run Migrations

```bash
python manage.py migrate
```

### 4. Create Superuser (Optional)

```bash
python manage.py createsuperuser
```

### 5. Start Redis & Celery Worker

Make sure Redis is running, then start Celery:

```bash
celery -A <project_name> worker --loglevel=info
```

### 6. Run Django Server

```bash
python manage.py runserver
```

Backend will run at:

```
http://localhost:8000
```

---

## 🌐 Frontend Setup

### 1. Navigate to Frontend Folder

```bash
cd Frontend
```

### 2. Install Node Dependencies

```bash
npm install
```

### 3. Start React Development Server

```bash
npm start
```

Frontend will run at:

```
http://localhost:3000
```

---

## 🔗 API Routes (Expected Structure)

Some standard REST endpoints used in the project include:

### Authentication
- POST `/api/auth/register/`  
- POST `/api/auth/login/`  

### Products
- GET `/api/products/`  
- POST `/api/products/` *(seller only)*  
- GET `/api/products/<id>/`  

### Categories
- GET `/api/categories/`  

### Cart
- GET `/api/cart/`  
- POST `/api/cart/add/`  
- DELETE `/api/cart/remove/`  

### Orders
- POST `/api/orders/`  
- GET `/api/orders/<id>/`  

### Payments
- POST `/api/payments/verify/`  

*(Exact routes can be confirmed inside the backend code.)*

---

# 🌍 Deployment — MeeshoClone

My **Meesho Clone** project is fully deployed using modern cloud platforms.  
Each layer of the application (Frontend, Backend, Database) is hosted separately to follow a real-world production architecture.

---

## 🗄️ Database (PostgreSQL) — Supabase

For storing all persistent data, I am using **PostgreSQL hosted on Supabase**.

Supabase provides a fully managed and scalable cloud database with an easy dashboard.

**Platform:** Supabase  
**Service Includes:**

- PostgreSQL Database  
- Cloud Hosting  
- Dashboard Access  
- Connection Pooling  

This database stores:

- Users (Customers & Sellers)
- Products & Categories
- Cart Items
- Orders & Payments

---

## ⚙️ Backend API — Render

The backend of this project is built with **Django REST Framework** and deployed on **Render**.

Render serves all REST API endpoints and also supports background task execution using Celery + Redis.

**Platform:** Render  
**Tech Stack:**

- Django REST Framework  
- Celery Worker Integration  
- Redis for background jobs and caching  

The backend handles:

- Authentication (Customer/Seller roles)
- Product, Cart, and Orders APIs
- Payment gateway testing integration
- Background tasks (PDF invoices + Email sending)

**Backend Base URL:**


[https://meeshoclone-api.onrender.com](https://meeshoclone-api.onrender.com)



---

## 🎨 Frontend — Vercel

The frontend is a React.js single-page application styled with Tailwind CSS.  
It is deployed on **Vercel**, which provides fast global hosting.

**Platform:** Vercel  
**Tech Stack:**

- React.js  
- Tailwind CSS  

The frontend provides:

- Customer shopping experience
- Seller dashboard interface
- Cart and checkout flow
- API integration with the Render backend

**Frontend Live Link:**

```

[https://meesho-clone-pink.vercel.app/](https://meesho-clone-pink.vercel.app/)

```

---

## 🔗 Deployment Architecture

The overall deployed system works like this:

```

Frontend (Vercel)
|
|  API Requests
v
Backend (Render)
|
|  Database Queries
v
Database (Supabase PostgreSQL)

```

---

## ✅ Hosting Summary

| Layer     | Platform  |
|----------|-----------|
| Frontend | Vercel    |
| Backend  | Render    |
| Database | Supabase  |

---

## ⭐ Note

Since Render free-tier services may spin down when inactive, the first API request after some time can take a few seconds due to **cold start**.
 The Only limitation is the hardware it is deployed on the servers are too far from each other so the communication takes a bit of a time but will give you response a little later than expected. 

---



---

## 🎯 Conclusion

MeeshoClone is a complete full-stack marketplace project where I implemented:

- Role-based seller/customer system  
- Product, cart, order management  
- Caching and Background Task for better task handling
- Payment gateway integration  
- Invoice + email automation using Celery  
- Modern frontend UI with React + Tailwind  

This project helped me understand how real e-commerce platforms work end-to-end. Helped me understand that you need to add a lot of services to create a small shopping app.
This project helped me understand how real e-commerce platforms work end-to-end. Helped me understand that you need to add a lot of services to create a small shopping app.
