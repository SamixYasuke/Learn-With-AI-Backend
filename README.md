# TypeScript Squeeze Page API Boilerplate

A TypeScript boilerplate for creating a Squeeze Page API using Express.js, TypeORM, PostgreSQL, and more. This project is designed to jumpstart your backend development with a well-structured and scalable setup.

---

## Features
- **TypeScript** for type safety and modern JavaScript features.
- **Express.js** for building RESTful APIs.
- **TypeORM** for database interactions with PostgreSQL.
- **dotenv** for environment variable management.
- **asyncHandler** utility for clean async code handling.
- Predefined API endpoints for CRUD operations on a Squeeze Page.

---

## Prerequisites
- [Node.js](https://nodejs.org/) (v16+ recommended)
- [PostgreSQL](https://www.postgresql.org/) installed and running
- [Git](https://git-scm.com/)

---

## Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/SamixYasuke/ts-squeeze-api-boilerplate.git
cd ts-squeeze-api-boilerplate
```

### 2. Install Dependencies
```bash
yarn
```

### 3. Set Up Environment Variables
Create a `.env` file in the root directory and add the following configuration:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_postgres_username
DB_PASSWORD=your_postgres_password
DB_NAME=your_database_name
PORT=3000
```

### 4. Set Up the Database
1. Log into PostgreSQL:
   ```bash
   psql -U your_postgres_username
   ```
2. Create the database:
   ```sql
   CREATE DATABASE your_database_name;
   ```

### 5. Run the Server
Start the development server:
```bash
yarn dev
```

The server will start on the port specified in your `.env` file (default is `3000`).

---

## Project Structure
```plaintext
src/
├── controllers/      # API controller logic
├── models/           # Database models
├── routes/           # API routes
├── services/         # Business logic
├── utils/            # Utility functions
├── database.ts       # Database connection setup
└── app.ts            # Express app setup
```

---

## Usage
### API Endpoints
#### 1. Fetch All Squeezes
```http
GET /api/squeezes
```

#### 2. Create a New Squeeze
```http
POST /api/squeezes
Content-Type: application/json
{
  "email": "example@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "phone": "1234567890",
  "location": "New York",
  "job_title": "Developer",
  "company": "TechCorp",
  "interests": ["Coding", "AI"],
  "referral_source": "Google Ads"
}
```

#### 3. Fetch a Squeeze by ID
```http
GET /api/squeezes/:id
```

---

## Scripts
- **`yarn dev`**: Run the server in development mode with hot reloading.

---

## Contributing
Feel free to submit issues or pull requests to improve this boilerplate.

---

## License
This project is licensed under the MIT License.

---

Happy coding from Adekolu Samuel(Samixx Yasuke)! 🎉
