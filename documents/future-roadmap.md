# Future Development Roadmap

## 1. Database & Persistence Migration
* **Database Integration**: Replace flat-file JSON storage with a persistent relational or document database (e.g., PostgreSQL with Prisma/Drizzle ORM or MongoDB with Mongoose). [Implemented PostgreSQL support via `pg` connection pool and `DATABASE_URL` environment variable in `lib/inventory.ts` with local JSON fallback].
* **Transactional Integrity**: Implement database-level transactions and locking mechanisms to ensure concurrency control and data consistency across operations.
* **Database Indexing & Pagination**: Implement database-level pagination, sorting, and indexing for inventory items.

## 2. Authentication & Authorization Enhancements
* **Unified Security Configuration**: Standardize `JWT_SECRET` enforcement across `lib/auth.ts` and `middleware.ts`.
* **Granular Role-Based Access Control (RBAC)**: Extend middleware and server actions to restrict admin capabilities (item creation, edit, deletion) while offering read-only access for standard users.
* **User Management System**: Implement user registration, password resets, profile editing, and multi-factor authentication (MFA).

## 3. Advanced Inventory Features
* **Item Editing Capability**: Add full update/edit functionality for existing inventory items in `lib/inventory.ts` and UI.
* **Categorization & Suppliers**: Support rich product categories, tags, supplier tracking, and reorder point thresholds.
* **Audit Logging**: Implement historical tracking and audit logs for stock adjustments and inventory updates.

## 4. Dashboard & Reporting Improvements
* **Real-time Notifications**: Implement automated low-stock notifications via email, Slack, or webhooks.
* **Enhanced Analytics**: Provide interactive charts, custom date range filtering, financial reports, and data export (CSV/Excel/PDF).

---

## Database Setup Instructions (PostgreSQL)

1. **Prerequisites**: Ensure PostgreSQL is installed and running.
2. **Create Database**:
   ```sql
   CREATE DATABASE inventory_db;
   ```
3. **Run Schema Migration**: Execute the SQL statements provided in `db/schema.sql` against your PostgreSQL database:
   ```bash
   psql -U your_username -d inventory_db -f db/schema.sql
   ```
4. **Configure Environment Variables**: Set the `DATABASE_URL` environment variable in your `.env.local` file (or deployment environment):
   ```env
   DATABASE_URL=postgresql://username:password@localhost:5432/inventory_db
   ```
5. **Runtime Behavior**: When `DATABASE_URL` is set, `lib/inventory.ts` automatically uses PostgreSQL for `getAllItems`, `getItemById`, `addItem`, `updateItem`, and `deleteItem`. If `DATABASE_URL` is not set, it gracefully falls back to local JSON file persistence for development/testing.
