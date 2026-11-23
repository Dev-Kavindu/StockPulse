# System Limitations

## 1. Authentication & Security
* **JWT Secret Management**: Requires manual configuration of `JWT_SECRET`. Misconfiguration results in authentication failure.
* **Database Dependency**: PostgreSQL is required for full functionality; local development without a database connection may require additional mocks (current system assumes `DATABASE_URL` is available).

## 2. Inventory & Dashboard
* **Scalability**: While PostgreSQL handles concurrent requests better than JSON, complex report generation over massive datasets (100k+ rows) requires additional database indexing strategy updates.
* **Pagination**: Large lists may require future integration of server-side pagination for optimal dashboard responsiveness.

## 3. UI/UX
* **Back Navigation**: Reliance on standard navigation; complex browser history state management may require further refinement for deeply nested views.
