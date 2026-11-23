# StockPulse — Next-Gen Inventory Control & Management System

StockPulse is a modern, full-stack inventory management web application built with **Next.js (App Router)**, **React**, **TypeScript**, and **Tailwind CSS**. Designed for warehouse operations and stock tracking, it provides real-time stock counts, valuation metrics, low-stock alerts, secure role-based access control, and robust persistent storage via **PostgreSQL**.

---

## Key Features
- **Persistent Inventory Management**: Fully relational backend using PostgreSQL (Supabase compatible) for secure, scalable data storage (Add, View, Edit, Delete).
- **Live Stock Analytics**: Track total inventory items, aggregate stock quantities, valuation metrics, and low-stock alerts (< 10 units) from a centralized dashboard.
- **Secure Authentication**: JWT-based sessions and user accounts with bcryptjs-hashed password storage. Includes support for `/register` and `/login`.
- **Responsive UI**: Mobile-friendly, tablet, and desktop-optimized design featuring intuitive navigation and full CRUD workflows.

---

## Local Setup

1. **Clone and Install**:
   ```bash
   git clone <repository-url>
   cd inventory-app
   npm install
   ```

2. **Configure Database & Environment**:
   - Create a PostgreSQL database and run `db/schema.sql`.
   - Seed sample data: `node db/seed.js`
   - Create a `.env.local` file:
     ```env
     DATABASE_URL=postgres://user:password@localhost:5432/db_name
     JWT_SECRET=your_super_secret_key
     ```

3. **Run**:
   ```bash
   npm run dev
   ```

---

## Deployment (Vercel)
1. Push code to your Git provider.
2. Link the repository to Vercel.
3. Add the `DATABASE_URL` and `JWT_SECRET` environment variables in Vercel project settings.
4. Deploy.

---

## AI Assistance Acknowledgment
This project was built and refined with assistance from cutting-edge AI software engineering tools (FORGE).
