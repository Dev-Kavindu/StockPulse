# System Limitations

## 1. Storage & Data Persistence Limitations
* **JSON File Storage**: Inventory data (`inventory.json`) and user accounts (`users.json`) are stored as local flat files.
* **Ephemeral Serverless Storage**: In production environments (e.g., Vercel), files stored in `/tmp/inventory.json` are ephemeral and reset across serverless container re-initializations or deployments.
* **Lack of Concurrency Control**: No file locking or transaction management exists when performing concurrent `addItem` or `deleteItem` operations, creating risk of data race conditions.
* **In-Memory Querying**: Filtering, sorting, and item lookup require reading the full JSON dataset into memory, which does not scale for large inventory volumes.

## 2. Authentication & Security Limitations
* **Synchronous File I/O**: `lib/auth.ts` uses synchronous file system calls (`fs.readFileSync`, `fs.existsSync`) to read user data during authentication.
* **Mismatched Secret Key Handling**: `middleware.ts` throws an error if `JWT_SECRET` is missing.
* **Lack of Role-Based Route Protection**: Middleware checks authentication state but does not enforce granular role-based permissions (e.g., restricting delete/create actions to `admin` users).
* **Missing User Management**: No API or UI endpoints for user registration, password changes, or profile management.

## 3. Inventory & Dashboard Limitations
* **Limited Item Editing**: Although `updateItem` is implemented, there is no specialized validation schema (e.g., Zod) for complex constraints beyond basic non-negative checks.
* **Dashboard Metric Constraints**: The dashboard recent items table is fixed to 5 items without pagination, filtering, or inline management options.
* **Strict Schema Assumptions**: Numeric calculations for quantity and price rely on client/server parsing without dedicated data validation schemas (e.g., Zod).
