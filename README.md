# DB
node db/seed.js     # Seed the database with initial data

# Backend
cd api
cp .env.example .env     # Create local environment config
npm install              # Install backend dependencies
npm run dev              # Start the development server
npm test                 # Run test cases (make sure DB logic is committed first)

# Frontend
cd Web
npm install
npm start
You can use any text or number as the password — no validation is required for this field.

# Degubber
- Sorting moved to MongoDB query using `.sort({ created: -1 })`
- Added `try/catch` blocks for consistent error handling in controllers
- Routes now directly return responses from controllers
