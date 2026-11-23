# Future Development Roadmap

## 1. Inventory Enhancements
* **Advanced Reporting**: Add export functionality (CSV/PDF) and custom date range filtering for valuation reports.
* **Audit Logging**: Create a dedicated `logs` table to track every change (user, action, timestamp) made to inventory items.
* **Notifications**: Automate low-stock alerts via Email, Slack, or Webhook.

## 2. Authentication & Security
* **Multi-Factor Authentication (MFA)**: Integrate MFA for enhanced administrative access security.
* **OAuth Integration**: Enable "Login with Google/GitHub" using Auth.js (NextAuth).

## 3. Performance & Scaling
* **Database Indexing**: Proactively analyze and add indices to `items` table columns (SKU, category) for high-performance searches.
* **Edge Caching**: Evaluate Vercel Edge Cache for read-heavy inventory dashboard data.

---

## Deployment Configuration

- **PostgreSQL**: Standard PostgreSQL instance (e.g., Supabase, Neon, AWS RDS).
- **Required Env Variables**:
  - `DATABASE_URL`: Connection string.
  - `JWT_SECRET`: Random long string for signing tokens.
