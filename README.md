# ShopSphere - Multi-Vendor E-Commerce Website

ShopSphere is a full-stack multi-vendor e-commerce web application built with **HTML, CSS, JavaScript, Spring Boot, and MySQL**.

The application provides separate customer, seller, and admin workflows, including product browsing, authentication, cart management, order processing, seller product management, product approval, inventory management, seller stores, and customer profiles.

## 🚀 Features

### 👤 Customer

* Customer registration and login
* JWT-based authentication
* Product browsing and product details
* Product search
* Category, price, rating, and availability filtering
* Shopping cart with quantity management
* Checkout and order placement
* Automatic stock deduction after placing an order
* Order confirmation
* Order history
* Order cancellation
* Customer profile
* Contact form

### 🏪 Seller

* Seller registration and login
* JWT-based authentication
* Seller store profile
* Seller dashboard
* Add new products
* Edit and delete products
* Product stock management
* Product approval workflow
* View seller products
* View customer orders containing seller products
* Update order status
* Seller earnings information
* Public seller store page

### 🔐 Admin

* Admin login
* JWT-based authentication
* View pending products
* Approve or reject seller products
* View approved and rejected products
* View customer orders
* Update order status

### 🛒 Product & Order Management

* Default product catalog
* Seller-added products
* Product approval system
* Product availability and stock tracking
* Multi-item shopping cart
* Order and order-item management
* Automatic inventory updates
* Customer order history
* Seller order management

## 🛠️ Technologies Used

### Frontend

* HTML5
* CSS3
* JavaScript
* Responsive Web Design

### Backend

* Java
* Spring Boot
* Spring Web
* Spring Data JPA
* Spring Security
* JWT Authentication
* Bean Validation

### Database

* MySQL
* Hibernate / JPA

### Tools

* Git
* GitHub
* Maven
* MySQL Workbench
* Postman
* Visual Studio Code

## 🏗️ Application Architecture

```text
Customer / Seller / Admin
          │
          ▼
     HTML / CSS / JS
          │
          │ REST API
          ▼
     Spring Boot
          │
     ┌────┴────┐
     │         │
 Security    Services
     │         │
     └────┬────┘
          ▼
    Spring Data JPA
          │
          ▼
       MySQL
```

## 🔄 Product Approval Workflow

```text
Seller
   │
   ▼
Add Product
   │
   ▼
PENDING
   │
   ▼
Admin Reviews Product
   │
   ├──► APPROVED ──► Product appears in Store / Products
   │
   └──► REJECTED
```

## 📦 Order Workflow

```text
Customer
   │
   ▼
Add Products to Cart
   │
   ▼
Checkout
   │
   ▼
Place Order
   │
   ▼
Spring Boot API
   │
   ├──► Save Order
   ├──► Save Order Items
   └──► Deduct Product Stock
   │
   ▼
Order History
```

## 📂 Project Structure

```text
ShopSphere-MultiVendor-Ecommerce/
│
├── index.html
│
├── pages/
│   ├── products.html
│   ├── product-details.html
│   ├── vendors.html
│   ├── store.html
│   ├── seller.html
│   ├── cart.html
│   ├── checkout.html
│   ├── login.html
│   ├── register.html
│   ├── profile.html
│   ├── orders.html
│   ├── order-confirmation.html
│   ├── admin-login.html
│   ├── admin-dashboard.html
│   ├── about.html
│   └── contact.html
│
├── css/
│   └── Frontend stylesheets
│
├── js/
│   └── Frontend JavaScript files
│
├── images/
│   └── Product and UI images
│
└── shopsphere-backend/
    ├── pom.xml
    ├── mvnw
    ├── mvnw.cmd
    │
    └── src/
        ├── main/
        │   ├── java/com/shopsphere/
        │   │   ├── config/
        │   │   ├── controller/
        │   │   ├── dto/
        │   │   ├── entity/
        │   │   ├── exception/
        │   │   ├── repository/
        │   │   ├── security/
        │   │   └── service/
        │   │
        │   └── resources/
        │       └── application.properties
        │
        └── test/
```

## 🔐 Authentication & Security

ShopSphere uses JWT-based authentication for protected customer, seller, and admin operations.

* Passwords are stored using BCrypt hashing
* JWT tokens are used for authenticated requests
* Role-based access control for customers, sellers, and admins
* Protected customer and seller resources
* Seller ownership validation for seller-specific operations
* Customer ownership validation for customer-specific resources
* CORS configuration for frontend-backend communication

## 🗄️ Database

The application uses **MySQL** with Spring Data JPA/Hibernate.

Main entities include:

* Customer
* Seller
* Admin
* Product
* Cart
* Order
* OrderItem
* ContactMessage

## ▶️ Running the Project Locally

### 1. Clone the repository

```bash
git clone https://github.com/Sayalimore2004/ShopSphere-MultiVendor-Ecommerce.git
```

### 2. Configure MySQL

Create a MySQL database named:

```text
ShopSphere
```

Configure the database connection in:

```text
shopsphere-backend/src/main/resources/application.properties
```

The database password is read through the `DB_PASSWORD` environment variable.

### 3. Set the database password

On Windows PowerShell:

```powershell
$env:DB_PASSWORD="your_mysql_password"
```

### 4. Start the Spring Boot backend

```powershell
cd shopsphere-backend
.\mvnw.cmd spring-boot:run
```

The backend runs on:

```text
http://localhost:8080
```

### 5. Run the frontend

Open the project using a local development server such as **VS Code Live Server**.

The frontend communicates with the Spring Boot REST API running on port `8080`.

## 🧪 Testing

The application was tested across the major customer, seller, and admin workflows, including:

* Registration and login
* JWT authentication
* Product management
* Product approval
* Cart operations
* Checkout
* Order placement
* Stock deduction
* Order history
* Order cancellation
* Seller order management
* Admin order management
* Customer profile
* Contact form

## 📌 Future Improvements

* Online payment gateway integration
* Production deployment
* Cloud-hosted database
* Advanced seller analytics
* Product reviews and ratings
* Image upload functionality
* Email notifications

## 👩‍💻 Author

**Sayali More**

B.E. Electronics & Telecommunication Engineering

GitHub:
https://github.com/Sayalimore2004

## ⭐ Project

**ShopSphere - Multi-Vendor E-Commerce Website**

A full-stack e-commerce project demonstrating frontend development, REST API development, database integration, authentication, authorization, inventory management, and role-based application workflows.
