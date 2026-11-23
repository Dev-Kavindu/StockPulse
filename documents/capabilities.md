# System Capabilities

## 1. Authentication & Session Management
* **JWT Token Security**: Generates and verifies JSON Web Tokens (JWT) using `jose` with 7-day expiration.
* **Password Security**: Uses `bcryptjs` for robust password hashing and verification.
* **Full Authentication Flow**: Supports `/register` and `/login` endpoints with session-based JWT persistence. Includes demo account fallback for immediate testing.
* **Role-Based Access Control (RBAC)**: Enforces access to sensitive features for `admin` vs `user` roles.

## 2. PostgreSQL Persistent Inventory (`db/schema.sql`)
* **Relational Database**: Fully backed by PostgreSQL, ensuring ACID compliance for critical inventory data.
* **CRUD Operations**: Complete support for creating, reading, updating, and deleting inventory items.
* **Data Initialization**: `db/seed.js` script allows for automated population of 20 realistic items, including scenarios for low-stock monitoring (< 10 units).
* **Supabase Compatible**: Designed for easy integration with PostgreSQL-based managed services like Supabase.

## 3. Dashboard Overview
* **Interactive UI**: Responsive dashboard for mobile, tablet, and desktop with clear navigation (Back buttons) and status tracking.
* **Inventory Analytics**: Real-time aggregate metrics including total units, valuation, and low-stock indicators.
