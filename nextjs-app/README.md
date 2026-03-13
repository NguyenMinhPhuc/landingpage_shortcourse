# Next.js scaffold for Landingpage Shortcourses

This minimal Next.js app demonstrates an API route that connects to SQL Server to read course data.

Quick start:

1. cd into the app:

```powershell
cd nextjs-app
```

2. Install dependencies:

```powershell
npm install
```

3. Copy `.env.example` to `.env` and fill your SQL Server credentials.

4. Run the dev server:

```powershell
npm run dev
```

5. Open http://localhost:3001 to see the example page which calls `/api/courses`.

Notes:
- The API route attempts to use environment variables to connect to SQL Server. If no valid DB config is present the route returns a helpful error and can be extended with a fallback.
- Example SQL table (simplified):

```sql
CREATE TABLE Courses (
  id INT PRIMARY KEY,
  title NVARCHAR(200),
  description NVARCHAR(MAX)
);
```
