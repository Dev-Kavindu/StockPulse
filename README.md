# StockPulse — Next-Gen Inventory Control & Management System

StockPulse is a modern, full-stack inventory management web application built with **Next.js (App Router)**, **React**, **TypeScript**, and **Tailwind CSS**. Designed for warehouse operations and stock tracking, it provides real-time stock counts, valuation metrics, low-stock alerts, secure role-based access control, and robust persistent storage.

---

## Project Overview

StockPulse streamlines inventory workflows with:
- **Live Stock Analytics**: Track total inventory items, aggregate stock quantities, valuation metrics, and low-stock indicators from a centralized dashboard.
- **Role-Based Access Control (RBAC)**: Distinct permissions for administrators and regular users.
- **Lightning Fast Search & Filter**: Filter items across multiple categories and search by SKU or product name.
- **Secure Authentication**: JWT-based session management using `jose` and `bcryptjs`.
- **Server Actions & API Routes**: Modern Next.js patterns for form handling and data mutations.

---

## Local Setup Steps

Follow these steps to run StockPulse locally on your machine:

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd inventory-app
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env.local` file in the root directory based on `.env.example`:
   ```bash
   cp .env.example .env.local
   ```
   Set the required variables (see [Required Environment Variables](#required-environment-variables)).

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Open the application**:
   Open [http://localhost:3000](http://localhost:3000) in your browser.

   *Demo Credentials:*
   - **Admin**: `admin@company.com` / `admin123`
   - **User**: `user@company.com` / `user123`

---

## Required Environment Variables

StockPulse requires the following environment variables (defined in `.env.local`):

- `JWT_SECRET`: Secret key used for signing and verifying JWT session tokens.
- `NEXT_PUBLIC_APP_URL`: Public base URL of the application (e.g. `http://localhost:3000`).

---

## Role Permissions

StockPulse features two user roles with distinct capabilities:

| Feature / Action | Admin (`admin`) | Regular User (`user`) |
| :--- | :---: | :---: |
| **View Dashboard & Analytics** | ✅ Yes | ✅ Yes |
| **Browse & Search Inventory Catalog** | ✅ Yes | ✅ Yes |
| **View Item Detail Pages** | ✅ Yes | ✅ Yes |
| **Add New Inventory Items** | ✅ Yes | ✅ Yes |
| **Delete Inventory Items** | ✅ Yes | ❌ No |

---

## Vercel Deployment Notes

When deploying StockPulse to serverless hosting platforms like Vercel, the application environment operates on a **read-only filesystem** for project source and static files.

- **Filesystem Fallback (`/tmp/inventory.json`)**: 
  In production (`NODE_ENV === "production"`), the inventory data persistence layer (`lib/inventory.ts`) automatically detects the production environment and falls back from the local `data/inventory.json` file to `/tmp/inventory.json`.
- **Initialization**: 
  Upon cold start in production, if `/tmp/inventory.json` does not yet exist, the application safely initializes it by copying the seed data from `data/inventory.json` (or falling back to an empty JSON array if unavailable) into the writable `/tmp` directory. This ensures seamless reads and writes (add/delete items) during serverless execution.

---

## AI Assistance Acknowledgment

This project was built and refined with assistance from cutting-edge AI software engineering tools (FORGE), helping accelerate architecture design, robust TypeScript implementation, security best practices, and documentation.
