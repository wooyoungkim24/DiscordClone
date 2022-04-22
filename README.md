# DiscordClone
1. Clone repo
     * git clone git@github.com:wooyoungkim24/DiscordClone.git
2. Install dependencies 
     * npm install
3. Create POSTGRESQL user with CREATEDB priveleges and a password
     * CREATE USER discord WITH PASSWORD 'password' CREATEDB
4. Create .env file modeled off of .env.example 
5. Enter in username and password in .env file
6. Create a JWT_SECRET variable in .env, as well as a port number
7. Add proxy to package.json in the frontend directory
     * "proxy": "http://localhost:5000"
8. npm install frontend and backend
9. Create Database, migrate, and seed
     * npx dotenv sequelize db:create
     * npx dotenv sequelize db:migrate
     * npx dotenv sequelize db:seed:all
10. Start backend and frontend
     * npm start <on both backend and frontend>
11. Navigate to http://localhost:3000 and begin demoing
