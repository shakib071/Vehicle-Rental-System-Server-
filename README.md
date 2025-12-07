# 🚗 Vehicle Rental System API

[![Node.js](https://img.shields.io/badge/Node.js-24.11.0-green)](https://nodejs.org/) 
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue)](https://www.typescriptlang.org/) 
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-8.16.3-blue)](https://www.postgresql.org/) 


A backend API for managing **vehicles, users, and bookings** with role-based access control (Admin & Customer), built with Node.js, TypeScript, Express.js, and PostgreSQL.
It's is a moduler API model where stucture is (route -> controller -> service logic).

---

## 🌐 Live Link

The Vehicle Rental System is deployed and can be accessed at:

**Live URL:** [https://vehicle-rental-system-lime.vercel.app/](https://vehicle-rental-system-lime.vercel.app/)

> ⚠️ Note: Some endpoints require authentication. Use a valid JWT token in the `Authorization` header for protected routes.


---

## 📝 Introduction

The Vehicle Rental System API allows:

- Admins to manage vehicles, users, and bookings  
- Customers to browse vehicles, make bookings, and cancel booking 
- Automatic booking return after rental period ends  
- Secure authentication with JWT
- Password Hasing Before Storing 

---

## 🗄️ Database Structure

### Users Table
| Field | Type | Notes |
|-------|------|------|
| id | SERIAL | Primary key |
| name | VARCHAR(100) | Required |
| email | VARCHAR(200) | Required, unique, lowercase |
| password | TEXT | Min 6 characters |
| phone | VARCHAR(20) | Required |
| role | VARCHAR(50) | 'admin' or 'customer' |

### Vehicles Table
| Field | Type | Notes |
|-------|------|------|
| id | SERIAL | Primary key |
| vehicle_name | TEXT | Required |
| type | VARCHAR(20) | 'car', 'bike', 'van', 'SUV' |
| registration_number | TEXT | Unique, Required |
| daily_rent_price | NUMERIC(12,3) | Positive |
| availability_status | VARCHAR(20) | 'available' or 'booked' |

### Bookings Table
| Field | Type | Notes |
|-------|------|------|
| id | SERIAL | Primary key |
| customer_id | INT | References Users(id) |
| vehicle_id | INT | References Vehicles(id) |
| rent_start_date | DATE | Required |
| rent_end_date | DATE | Required, must be after start |
| total_price | NUMERIC(12,3) | Positive |
| status | VARCHAR(20) | 'active', 'cancelled', 'returned' |

---

## 📂 File Structure

### Description
- **src/modules/auth/**: Handles login, signup, and token verification.
- **src/modules/users/**: Contains user-related controllers and business logic.
- **src/modules/vehicles/**: Contains vehicle-related controllers and business logic.
- **src/modules/bookings/**: Contains booking-related controllers and business logic.
- **src/config/db.ts**: Database connection setup and creating table.
- **src/config/index.ts**: Central configuration for environment variables.
- **src/server.ts**: Main entry point to start the Express server.
- **src/middleware/**: Handles the middleware to authenticate user and admin. 


---


## 🧩 Dependencies

The project uses the following Node.js packages:

### Production Dependencies
| Package         | Version  | Description                                      |
|-----------------|----------|--------------------------------------------------|
| `bcryptjs`      | ^3.0.3   | Password hashing                                 |
| `dotenv`        | ^17.2.3  | Environment variable management                  |
| `express`       | ^5.2.1   | Web framework                                    |
| `jsonwebtoken`  | ^9.0.3   | JWT authentication                               |
| `pg`            | ^8.16.3  | PostgreSQL client                                |

### Development Dependencies
| Package                | Version    | Description                                      |
|------------------------|------------|--------------------------------------------------|
| `@types/express`       | ^5.0.6     | Type definitions for Express.js                  |
| `@types/jsonwebtoken`  | ^9.0.10    | Type definitions for jsonwebtoken               |
| `@types/pg`            | ^8.15.6    | Type definitions for PostgreSQL client          |
| `tsx`                  | ^4.21.0    | TypeScript runtime for development              |
| `typescipt`            | ^1.0.0     | TypeScript compiler                              |


---

## ⚙️ Environment Variables

Create a `.env` file in the root directory:

    CONNECTION_STRING=Your_postgresql_connection_string
    PORT=Your_port_number
    JWT_SECRET=Your_jwt_secret





## 🔐 Authentication Endpoints

### 1. User Registration

**Access:** Public  
**Description:** Register a new user account

#### Endpoint
```
POST /api/v1/auth/signup
```

#### Request Body
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "securePassword123",
  "phone": "01712345678",
  "role": "customer"
}
```

#### Success Response (201 Created)
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john.doe@example.com",
    "phone": "01712345678",
    "role": "customer"
  }
}
```

---

### 2. User Login

**Access:** Public  
**Description:** Login and receive JWT authentication token

#### Endpoint
```
POST /api/v1/auth/signin
```

#### Request Body
```json
{
  "email": "john.doe@example.com",
  "password": "securePassword123"
}
```

#### Success Response (200 OK)
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john.doe@example.com",
      "phone": "+1234567890",
      "role": "customer"
    }
  }
}
```

---

## 🚗 Vehicle Endpoints

### 3. Create Vehicle

**Access:** Admin only  
**Description:** Add a new vehicle to the system

#### Endpoint
```
POST /api/v1/vehicles
```

#### Request Headers
```
Authorization: Bearer <jwt_token>
```

#### Request Body
```json
{
  "vehicle_name": "Toyota Camry 2024",
  "type": "car",
  "registration_number": "ABC-1234",
  "daily_rent_price": 50,
  "availability_status": "available"
}
```

#### Success Response (201 Created)
```json
{
  "success": true,
  "message": "Vehicle created successfully",
  "data": {
    "id": 1,
    "vehicle_name": "Toyota Camry 2024",
    "type": "car",
    "registration_number": "ABC-1234",
    "daily_rent_price": 50,
    "availability_status": "available"
  }
}
```

---

### 4. Get All Vehicles

**Access:** Public  
**Description:** Retrieve all vehicles in the system

#### Endpoint
```
GET /api/v1/vehicles
```

#### Success Response (200 OK)
```json
{
  "success": true,
  "message": "Vehicles retrieved successfully",
  "data": [
    {
      "id": 1,
      "vehicle_name": "Toyota Camry 2024",
      "type": "car",
      "registration_number": "ABC-1234",
      "daily_rent_price": 50,
      "availability_status": "available"
    },
    {
      "id": 2,
      "vehicle_name": "Honda Civic 2023",
      "type": "car",
      "registration_number": "XYZ-5678",
      "daily_rent_price": 45,
      "availability_status": "available"
    }
  ]
}
```

#### Success Response - Empty List (200 OK)
```json
{
  "success": true,
  "message": "No vehicles found",
  "data": []
}
```

---

### 5. Get Vehicle by ID

**Access:** Public  
**Description:** Retrieve specific vehicle details

#### Endpoint
```
GET /api/v1/vehicles/:vehicleId
```

**Example:**
```
GET /api/v1/vehicles/2
```

#### Success Response (200 OK)
```json
{
  "success": true,
  "message": "Vehicle retrieved successfully",
  "data": {
    "id": 2,
    "vehicle_name": "Honda Civic 2023",
    "type": "car",
    "registration_number": "XYZ-5678",
    "daily_rent_price": 45,
    "availability_status": "available"
  }
}
```

---

### 6. Update Vehicle

**Access:** Admin only  
**Description:** Update vehicle details, price, or availability status

#### Endpoint
```
PUT /api/v1/vehicles/:vehicleId
```

**Example:**
```
PUT /api/v1/vehicles/1
```

#### Request Headers
```
Authorization: Bearer <jwt_token>
```

#### Request Body (All fields optional)
```json
{
  "vehicle_name": "Toyota Camry 2024 Premium",
  "type": "car",
  "registration_number": "ABC-1234",
  "daily_rent_price": 55,
  "availability_status": "available"
}
```

#### Success Response (200 OK)
```json
{
  "success": true,
  "message": "Vehicle updated successfully",
  "data": {
    "id": 1,
    "vehicle_name": "Toyota Camry 2024 Premium",
    "type": "car",
    "registration_number": "ABC-1234",
    "daily_rent_price": 55,
    "availability_status": "available"
  }
}
```

---

### 7. Delete Vehicle

**Access:** Admin only  
**Description:** Delete a vehicle (only if no active bookings exist)

#### Endpoint
```
DELETE /api/v1/vehicles/:vehicleId
```

**Example:**
```
DELETE /api/v1/vehicles/1
```

#### Request Headers
```
Authorization: Bearer <jwt_token>
```

#### Success Response (200 OK)
```json
{
  "success": true,
  "message": "Vehicle deleted successfully"
}
```

---

## 👥 User Endpoints

### 8. Get All Users

**Access:** Admin only  
**Description:** Retrieve all users in the system

#### Endpoint
```
GET /api/v1/users
```

#### Request Headers
```
Authorization: Bearer <jwt_token>
```
#### Success Response (200 OK)
```json
{
  "success": true,
  "message": "Users retrieved successfully",
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john.doe@example.com",
      "phone": "+1234567890",
      "role": "customer"
    },
    {
      "id": 2,
      "name": "Admin User",
      "email": "admin@example.com",
      "phone": "+0987654321",
      "role": "admin"
    }
  ]
}
```

---

### 9. Update User

**Access:** Admin or Own Profile  
**Description:** Admin can update any user's role or details. Customer can update own profile only

#### Endpoint
```
PUT /api/v1/users/:userId
```

**Example:**
```
PUT /api/v1/users/1
```

#### Request Headers
```
Authorization: Bearer <jwt_token>
```

#### Request Body (All fields optional)
```json
{
  "name": "John Doe Updated",
  "email": "john.updated@example.com",
  "phone": "+1234567899",
  "role": "admin"
}
```

#### Success Response (200 OK)
```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "id": 1,
    "name": "John Doe Updated",
    "email": "john.updated@example.com",
    "phone": "+1234567899",
    "role": "customer"
  }
}
```

---

### 10. Delete User

**Access:** Admin only  
**Description:** Delete a user (only if no active bookings exist)

#### Endpoint
```
DELETE /api/v1/users/:userId
```

**Example:**
```
DELETE /api/v1/users/1
```

#### Request Headers
```
Authorization: Bearer <jwt_token>
```

#### Success Response (200 OK)
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

---

## 📅 Booking Endpoints

### 11. Create Booking

**Access:** Customer or Admin  
**Description:** Create a new booking with automatic price calculation and vehicle status update

#### Endpoint
```
POST /api/v1/bookings
```

#### Request Headers
```
Authorization: Bearer <jwt_token>
```

#### Request Body
```json
{
  "customer_id": 1,
  "vehicle_id": 2,
  "rent_start_date": "2024-01-15",
  "rent_end_date": "2024-01-20"
}
```

#### Success Response (201 Created)
```json
{
  "success": true,
  "message": "Booking created successfully",
  "data": {
    "id": 1,
    "customer_id": 1,
    "vehicle_id": 2,
    "rent_start_date": "2024-01-15",
    "rent_end_date": "2024-01-20",
    "total_price": 250,
    "status": "active",
    "vehicle": {
      "vehicle_name": "Honda Civic 2023",
      "daily_rent_price": 45
    }
  }
}
```

---

### 12. Get All Bookings

**Access:** Role-based (Admin sees all, Customer sees own)  
**Description:** Retrieve bookings based on user role

#### Endpoint
```
GET /api/v1/bookings
```

#### Request Headers
```
Authorization: Bearer <jwt_token>
```

#### Success Response (200 OK) - Admin View
```json
{
  "success": true,
  "message": "Bookings retrieved successfully",
  "data": [
    {
      "id": 1,
      "customer_id": 1,
      "vehicle_id": 2,
      "rent_start_date": "2024-01-15",
      "rent_end_date": "2024-01-20",
      "total_price": 250,
      "status": "active",
      "customer": {
        "name": "John Doe",
        "email": "john.doe@example.com"
      },
      "vehicle": {
        "vehicle_name": "Honda Civic 2023",
        "registration_number": "XYZ-5678"
      }
    }
  ]
}
```

#### Success Response (200 OK) - Customer View
```json
{
  "success": true,
  "message": "Your bookings retrieved successfully",
  "data": [
    {
      "id": 1,
      "vehicle_id": 2,
      "rent_start_date": "2024-01-15",
      "rent_end_date": "2024-01-20",
      "total_price": 250,
      "status": "active",
      "vehicle": {
        "vehicle_name": "Honda Civic 2023",
        "registration_number": "XYZ-5678",
        "type": "car"
      }
    }
  ]
}
```

---

### 13. Update Booking

**Access:** Role-based  
**Description:** Update booking status based on user role and business rules

#### Endpoint
```
PUT /api/v1/bookings/:bookingId
```

**Example:**
```
PUT /api/v1/bookings/1
```

#### Request Headers
```
Authorization: Bearer <jwt_token>
```

#### Request Body - Customer Cancellation
```json
{
  "status": "cancelled"
}
```

#### Request Body - Admin Mark as Returned
```json
{
  "status": "returned"
}
```

#### Success Response (200 OK) - Cancelled
```json
{
  "success": true,
  "message": "Booking cancelled successfully",
  "data": {
    "id": 1,
    "customer_id": 1,
    "vehicle_id": 2,
    "rent_start_date": "2024-01-15",
    "rent_end_date": "2024-01-20",
    "total_price": 250,
    "status": "cancelled"
  }
}
```

#### Success Response (200 OK) - Returned
```json
{
  "success": true,
  "message": "Booking marked as returned. Vehicle is now available",
  "data": {
    "id": 1,
    "customer_id": 1,
    "vehicle_id": 2,
    "rent_start_date": "2024-01-15",
    "rent_end_date": "2024-01-20",
    "total_price": 250,
    "status": "returned",
    "vehicle": {
      "availability_status": "available"
    }
  }
}
```

---

## 📝 Common Response Patterns

### Standard Success Response Structure
```json
{
  "success": true,
  "message": "Operation description",
  "data": "Response data"
}
```

### Standard Error Response Structure
```json
{
  "success": false,
  "message": "Error description",
  "errors": "Error description"
}
```




---

## 🚀 Installation

1. **Clone the repo:**
    ```bash
    git clone https://github.com/shakib071/Vehicle-Rental-System-Server-.git
    cd vehicle-rental-system-server

2. **Install dependencies:**
    ```bash
    npm install

3. **Build TypeScript:**
    ```bash
    npm run build

4. **Run in development mode: **

    ```bash
    npm run dev
