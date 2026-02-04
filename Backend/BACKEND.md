# ⚙️ Backend Documentation — MeeshoClone

## 📌 Overview

The `Backend/` directory contains the Django-based REST API server for my **MeeshoClone** project.

I have built the backend using **Django** and **Django REST Framework (DRF)** to handle all core e-commerce functionalities such as:

- User authentication (Customer & Seller roles)
- Product and category management
- Cart and order processing
- Payment integration (Razorpay test mode)
- Background tasks like email sending and PDF invoice generation

All persistent data is stored inside a **PostgreSQL database**.

---

## 📂 Backend Project Structure

Although the exact folder layout may vary, my backend follows a standard Django + DRF structure similar to this:

```

Backend/
│
├── <project_name>/          # Main Django project configuration
│   ├── settings.py          # Database, apps, REST, Celery config
│   ├── urls.py              # Root API routing
│   ├── wsgi.py
│   └── celery.py            # Celery setup
│
├── users/                   # User authentication + role handling
├── products/                # Product + category APIs
├── orders/                  # Cart, orders, payments, invoices
│
├── tasks.py                 # Celery background tasks
├── requirements.txt         # Backend dependencies
└── static/ (optional)       # Static/media files

```

---

## 📦 Key Backend Components

### `requirements.txt`

This file includes all backend dependencies such as:

- Django  
- Django REST Framework  
- PostgreSQL driver  
- Celery  
- Redis  
- WeasyPrint  
- Razorpay SDK  
- Mailtrap SMTP tools  

---

### `settings.py`

This is where I configure:

- PostgreSQL database connection  
- Installed Django apps  
- DRF authentication settings  
- Mailtrap email service  
- Celery + Redis broker configuration  
- Media/static handling  

---

### Serializers (`serializers.py`)

I use DRF serializers to convert Django models into JSON responses and validate incoming request data.

---

### Views (`views.py`)

All API logic is written using DRF views or viewsets, handling:

- GET, POST, PUT, DELETE operations  
- Role-based permissions  
- Checkout workflows  
- Order creation and payment verification  

---

### Background Tasks (`tasks.py`)

To avoid slowing down API requests, I offload heavy tasks using Celery, such as:

- Sending order confirmation emails  
- Generating PDF invoices  
- Running asynchronous processing after checkout  

---

## 🌐 REST API Routes

The backend exposes RESTful JSON APIs for all major entities.

Even though the exact URLs are defined in code, the structure follows standard DRF conventions.

---

## 🔐 Authentication APIs

These endpoints handle login and registration:

- `POST /api/auth/register/` → Register a new customer or seller  
- `POST /api/auth/login/` → Login and receive token/session  
- *(Optional)* Logout / Token refresh routes  

---

## 👥 Users & Roles

The backend supports two roles:

- **Customer** → Can browse products, add to cart, place orders  
- **Seller** → Can add products and view incoming orders  

Role-based permissions ensure sellers cannot access customer-only routes and vice versa.

---

## 🗂️ Category APIs

- `GET /api/categories/` → List all categories  
- `POST /api/categories/` → Add new category (admin/seller only)  
- `GET /api/categories/<id>/` → Retrieve category  
- `PUT /api/categories/<id>/` → Update category  
- `DELETE /api/categories/<id>/` → Remove category  

---

## 🛍️ Product APIs

- `GET /api/products/` → List/search products  
- `POST /api/products/` → Add product (seller only)  
- `GET /api/products/<id>/` → Product details  
- `PUT /api/products/<id>/` → Update product  
- `DELETE /api/products/<id>/` → Delete product  

Filters and query parameters may also be supported for searching.

---

## 🛒 Cart APIs

- `GET /api/cart/` → View current user cart  
- `POST /api/cart/` → Add item to cart (product + quantity)  
- `DELETE /api/cart/<item_id>/` → Remove item from cart  

---

## 📦 Order APIs

- `GET /api/orders/` → List orders for current user  
- `POST /api/orders/` → Checkout and create new order  
- `GET /api/orders/<order_id>/` → Order details + invoice info  

Order creation triggers payment flow and background tasks.

---

## 💳 Payment APIs

Payment integration is done using **Razorpay (Test Mode)**.

- `POST /api/payments/verify/` → Verify transaction after payment  

During checkout:

1. Order is created  
2. Razorpay payment is initiated  
3. Payment is verified  
4. Order status is updated to *paid*  

---

## 🧾 Invoice APIs

Invoices are generated using **WeasyPrint**.

- `GET /api/orders/<order_id>/invoice/` → Download PDF invoice  

Invoices may be generated in the background via Celery.

---

## ⚡ Background Tasks (Celery + Redis)

To improve performance, I use:

### ✅ Celery Workers

Handles async tasks like:

- Sending confirmation emails  
- Generating invoices  
- Post-payment workflows  

### ✅ Redis

Used as:

- Celery message broker  
- Optional caching layer for frequently accessed data (like product lists)

---

## 🗄️ Data Models (Expected Design)

The backend database includes models such as:

### User

- Extended Django user with role field (seller/customer)

### Category

- `id`, `name`, optional description/image

### Product

- Name, description, price, stock  
- ForeignKey to Category  
- ForeignKey to Seller  

### CartItem

- User, product, quantity

### Order

- User, status, total_amount  
- Payment ID, timestamps

### OrderItem

- Links products inside an order  
- Quantity and price per item

This are only the important data models added not all.



---

✅ This backend is designed to be scalable, modular, and production-ready, supporting a complete marketplace workflow similar to Meesho.

