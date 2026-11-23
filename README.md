# StockPulse: Inventory Management System

StockPulse is a robust, full-stack inventory management system built with **Next.js 16 (App Router)** and **Tailwind CSS v4**. It leverages **PostgreSQL** for persistent data storage (via the `pg` driver and Supabase-compatible architecture), secured by **JWT** session authentication and **bcryptjs** for secure password hashing.

---

## 🛠 Tech Stack

| Component | Technology |
| :--- | :--- |
| **Framework** | Next.js 16 (App Router) |
| **Styling** | Tailwind CSS v4 |
| **Database** | PostgreSQL (`pg` driver, Supabase-compatible) |
| **Auth** | JWT Sessions & `bcryptjs` |
| **Language** | TypeScript |

---

## 🚀 Core Features

*   **Inventory Management**: Full CRUD lifecycle (Add, View with Back navigation, Edit, Delete).
*   **Sample Data**: Includes `db/seed.js` script to bootstrap 20 initial items.
*   **Low-Stock Monitoring**: Responsive UI visual indicators for items with stock levels `< 10`.
*   **User Authentication**: Secure registration (`/register`) and login (`/login`) workflows with demo fallback credentials support.
*   **Admin Controls**: Secure `/users` route for administrators to:
    *   List all registered users.
    *   Promote/Demote roles between `user` and `admin`.
    *   Delete user accounts.
*   **Responsive Design**: Fluid mobile-first UI optimized for mobile, tablet, and desktop viewports.

---

## ⚙️ Local Setup

### 1. Prerequisites
Ensure [Node.js](https://nodejs.org/) and a PostgreSQL instance (e.g., local install or Supabase) are installed and running.

### 2. Installation
```bash
# Clone the repository
git clone <repository-url>
cd inventory-app

# Install dependencies
npm install
```

### 3. Database & Environment Configuration
1.  **Schema**: Initialize the database tables using the provided schema:
    ```bash
    psql -d [your_db_name] -f db/schema.sql
    ```
2.  **Environment**: Create a `.env.local` file in the project root with the following keys:
    ```env
    DATABASE_URL=postgres://[user]:[password]@localhost:5432/[db_name]
    JWT_SECRET=your_super_secret_random_string
    ```
3.  **Seed Data**: Populate the database with the initial 20 inventory items:
    ```bash
    node db/seed.js
    ```

### 4. Development
```bash
npm run dev
```

---

## 🌐 Deployment (Vercel)

StockPulse is configured for easy deployment on Vercel:

1.  **Repository**: Push your source code to a GitHub repository.
2.  **Import**: Connect your repository to Vercel via the Vercel dashboard.
3.  **Environment Variables**: In the Vercel Project Settings > Environment Variables, add:
    *   `DATABASE_URL`: The connection string for your production PostgreSQL database.
    *   `JWT_SECRET`: A secure, unique secret key for JWT signing.
4.  **Deploy**: Initiate the build/deploy process. Vercel will automatically run your build scripts.
