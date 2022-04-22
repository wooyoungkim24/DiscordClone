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

## Technologies Used
<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/2300px-React-icon.svg.png" alt="React" width="50"/><img src="https://miro.medium.com/max/312/1*SRL22ADht1NU4LXUeU4YVg.png" alt="Redux" width="50"/><img src="https://pngset.com/images/node-js-nodejs-number-symbol-text-recycling-symbol-transparent-png-1383018.png" alt="NodeJS" width="50"/><img src="https://user-images.githubusercontent.com/24623425/36042969-f87531d4-0d8a-11e8-9dee-e87ab8c6a9e3.png" alt="PostgreSQL" width="50"/><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Python.svg/1200px-Python.svg.png" alt="Python" width="50"/><img src="https://cdn.iconscout.com/icon/free/png-256/javascript-2752148-2284965.png" alt="Javascript" width="50"/><img src="https://lms.techxyte.com/assets/technologies-logos/274/3.png" alt="SQLAlchemy" width="50"/><img src="https://sooftware.io/static/13c286ed78e56cb5a139e269d8eaea5f/fe339/flask.png" alt="Flask" width="50"/><img src="https://cdn-icons-png.flaticon.com/512/732/732212.png" alt="HTML" width="50"/><img src="https://cdn4.iconfinder.com/data/icons/iconsimple-programming/512/css-512.png" alt="CSS" width="50"/>

### Index
| [MVP Features List](https://github.com/wooyoungkim24/DiscordClone/wiki/Features) | [Database Schema](https://github.com/wooyoungkim24/DiscordClone/wiki/Database-Schema) | [User Stories]https://github.com/wooyoungkim24/DiscordClone/wiki/User-Stories | [Wireframe](https://github.com/wooyoungkim24/DiscordClone/wiki/WireFrames) |


### Features
Users cannot use any features until authorized.
Logged in users can perform the following actions.

* View all servers they belong to/own
* Edit any servers belonging to them
* Delete any servers belonging to them
* Leave servers they are members of
* Create new servers
* Create new text channels in servers they own
* Edit text channels in servers they own
* Delete text channels in servers they own
* Write messages in text channels to other users that are members of that server in real time
* Create Direct Messages with other users that are your friends
* Speak with other users in real time through direct message
* Invite other users who are friends to servers that you yourself are part of
* Add other users to be friends
