# System Capabilities

## 1. Authentication & Session Management (`lib/auth.ts`, `middleware.ts`)
* **JWT Token Security**: Generates and verifies JSON Web Tokens (JWT) using the `jose` library with HS256 signature algorithm and 7-day expiration.
* **HTTP-Only Cookie Sessions**: Manages session state via `httpOnly`, `sameSite: "lax"`, and production-secured cookies named `session`.
* **Password Hashing & Authentication**: Validates user credentials against `data/users.json` using `bcryptjs` password comparison (`bcrypt.compare`).
* **Role Support**: Supports user roles (`admin` and `user`).
* **Route Protection**: Next.js edge middleware checks session validity and protects `/dashboard` and `/inventory` routes, automatically redirecting unauthenticated requests to `/login?from=<path>`.
* **Smart Redirection**: Redirects authenticated users attempting to access `/login` back to `/dashboard`.

## 2. Inventory Data Management (`lib/inventory.ts`)
* **Data Operations**: Supports retrieval of all items (`getAllItems`), single item lookup (`getItemById`), creation (`addItem`), deletion (`deleteItem`), and updates (`updateItem`).
* **Environment-Aware Storage**: Dynamically switches storage paths between `data/inventory.json` (development) and `/tmp/inventory.json` (production).
* **Automatic Initialization**: Gracefully creates directories and fallback empty dataset if the JSON storage file is absent or corrupted.
* **Data Validation**: Validates quantity and price during updates to ensure non-negative values.

## 3. Dashboard Overview (`app/dashboard/page.tsx`)
* **User Context**: Displays the authenticated user's name and role badge (`admin` / `user`).
* **Inventory Metrics**: Calculates and renders key performance metrics:
  * **Total Items**: Total count of unique SKUs.
  * **Total Stock**: Sum of all physical units in inventory.
  * **Total Value**: Total inventory financial valuation (`quantity * price`).
  * **Low Stock Alerts**: Count of items with stock quantity below threshold (< 10 units), highlighted visually in rose/red.
* **Recent Activity**: Displays a table of the 5 most recently added items ordered by creation date.
* **Navigation**: Provides direct navigation links to inventory management and detailed item views.
