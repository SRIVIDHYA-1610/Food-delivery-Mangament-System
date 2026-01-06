# 🔧 Helpful Commands Reference

## Quick Start Commands

### Initial Setup
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Create Environment File
```bash
# Windows
cd backend
copy .env.example .env

# Mac/Linux
cd backend
cp .env.example .env
```

### Start Development Servers
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

---

## MongoDB Commands

### Start MongoDB
```bash
# Windows (as service)
net start MongoDB

# Windows (manual)
mongod

# Mac (Homebrew)
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

### Stop MongoDB
```bash
# Windows (as service)
net stop MongoDB

# Mac (Homebrew)
brew services stop mongodb-community

# Linux
sudo systemctl stop mongod
```

### Check MongoDB Status
```bash
# Windows
tasklist | findstr mongod

# Mac/Linux
ps aux | grep mongod
```

### MongoDB Shell
```bash
# Connect to database
mongosh

# Or older version
mongo

# Use specific database
use food-delivery

# Show collections
show collections

# View users
db.users.find().pretty()

# View restaurants
db.restaurants.find().pretty()

# View orders
db.orders.find().pretty()

# Clear all orders (for testing)
db.orders.deleteMany({})

# Drop database (careful!)
db.dropDatabase()
```

---

## NPM Commands

### Backend Commands
```bash
cd backend

# Install dependencies
npm install

# Start development server (with nodemon)
npm run dev

# Start production server
npm start

# Install specific package
npm install package-name

# Update dependencies
npm update

# Check for outdated packages
npm outdated
```

### Frontend Commands
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Install specific package
npm install package-name
```

---

## Git Commands

### Initial Setup
```bash
# Initialize git repository
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Food delivery application"

# Add remote repository
git remote add origin <your-repo-url>

# Push to remote
git push -u origin main
```

### Regular Workflow
```bash
# Check status
git status

# Add changes
git add .

# Commit changes
git commit -m "Your commit message"

# Push changes
git push

# Pull latest changes
git pull

# Create new branch
git checkout -b feature-name

# Switch branch
git checkout branch-name

# Merge branch
git merge branch-name
```

---

## Process Management

### Find Process Using Port
```bash
# Windows
netstat -ano | findstr :5000
netstat -ano | findstr :3000

# Mac/Linux
lsof -i :5000
lsof -i :3000
```

### Kill Process
```bash
# Windows
taskkill /PID <PID> /F

# Mac/Linux
kill -9 <PID>
```

### Kill Node Processes
```bash
# Windows
taskkill /F /IM node.exe

# Mac/Linux
killall node
```

---

## Testing Commands

### Test API with cURL

#### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"Test User\",\"email\":\"test@example.com\",\"password\":\"password123\",\"phone\":\"+1234567890\",\"role\":\"user\"}"
```

#### Login
```bash
curl -X POST http://localhost:5000/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"test@example.com\",\"password\":\"password123\"}"
```

#### Get Restaurants
```bash
curl http://localhost:5000/api/restaurants
```

#### Get Current User (with token)
```bash
curl http://localhost:5000/api/auth/me ^
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Debugging Commands

### Check Node Version
```bash
node --version
node -v
```

### Check NPM Version
```bash
npm --version
npm -v
```

### Check MongoDB Version
```bash
mongod --version
```

### View Backend Logs
```bash
# Backend logs are in the terminal where you ran npm run dev
# Look for errors in red text
```

### View Frontend Logs
```bash
# Frontend logs are in browser console (F12)
# Also check terminal for build errors
```

### Clear NPM Cache
```bash
npm cache clean --force
```

### Reinstall Dependencies
```bash
# Remove node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Windows
rmdir /s node_modules
del package-lock.json

# Reinstall
npm install
```

---

## Database Management

### Backup Database
```bash
# Backup entire database
mongodump --db food-delivery --out ./backup

# Restore database
mongorestore --db food-delivery ./backup/food-delivery
```

### Export Collection
```bash
# Export to JSON
mongoexport --db food-delivery --collection users --out users.json

# Import from JSON
mongoimport --db food-delivery --collection users --file users.json
```

---

## Production Build Commands

### Build Frontend
```bash
cd frontend
npm run build

# Output will be in frontend/dist
```

### Serve Production Build Locally
```bash
cd frontend
npm run preview
```

---

## Environment Management

### View Environment Variables
```bash
# Windows
echo %PORT%
echo %MONGODB_URI%

# Mac/Linux
echo $PORT
echo $MONGODB_URI
```

### Set Environment Variables (Temporary)
```bash
# Windows
set PORT=5001

# Mac/Linux
export PORT=5001
```

---

## Useful Development Commands

### Watch for File Changes
```bash
# Backend already uses nodemon in dev mode
# Frontend uses Vite's HMR automatically
```

### Format Code (if Prettier is installed)
```bash
npx prettier --write "**/*.{js,jsx,json,css,md}"
```

### Lint Code (if ESLint is installed)
```bash
npx eslint "**/*.{js,jsx}"
```

---

## Docker Commands (Optional)

### If you want to use Docker:

```bash
# Build backend image
docker build -t food-delivery-backend ./backend

# Build frontend image
docker build -t food-delivery-frontend ./frontend

# Run MongoDB container
docker run -d -p 27017:27017 --name mongodb mongo

# Run backend container
docker run -d -p 5000:5000 --name backend food-delivery-backend

# Run frontend container
docker run -d -p 3000:3000 --name frontend food-delivery-frontend

# View running containers
docker ps

# Stop containers
docker stop mongodb backend frontend

# Remove containers
docker rm mongodb backend frontend
```

---

## Performance Testing

### Test API Response Time
```bash
# Windows (PowerShell)
Measure-Command { curl http://localhost:5000/api/restaurants }

# Mac/Linux
time curl http://localhost:5000/api/restaurants
```

---

## Maintenance Commands

### Update All Dependencies
```bash
# Check for updates
npm outdated

# Update all to latest
npm update

# Update specific package
npm update package-name

# Update to latest major version
npm install package-name@latest
```

### Security Audit
```bash
# Check for vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix

# Force fix (may break things)
npm audit fix --force
```

---

## Quick Reference

### Start Everything
```bash
# Terminal 1
cd backend && npm run dev

# Terminal 2
cd frontend && npm run dev
```

### Stop Everything
```bash
# Press Ctrl+C in both terminals
# Or close the terminals
```

### Reset Database
```bash
mongosh
use food-delivery
db.dropDatabase()
exit
```

### Fresh Install
```bash
# Backend
cd backend
rm -rf node_modules package-lock.json
npm install

# Frontend
cd ../frontend
rm -rf node_modules package-lock.json
npm install
```

---

## Troubleshooting Commands

### Check if Port is Available
```bash
# Windows
netstat -an | findstr :5000

# Mac/Linux
lsof -i :5000
```

### Check Network Connectivity
```bash
# Test backend from frontend
curl http://localhost:5000/api/health

# Test MongoDB connection
mongosh --eval "db.adminCommand('ping')"
```

### View All Node Processes
```bash
# Windows
tasklist | findstr node

# Mac/Linux
ps aux | grep node
```

---

## Keyboard Shortcuts

### Terminal
- `Ctrl + C` - Stop running process
- `Ctrl + L` - Clear terminal (Mac/Linux)
- `cls` - Clear terminal (Windows)
- `↑` / `↓` - Navigate command history

### VS Code
- `Ctrl + `` - Toggle terminal
- `Ctrl + Shift + `` - New terminal
- `Ctrl + P` - Quick file open
- `Ctrl + Shift + F` - Search in files

---

## Helpful Aliases (Optional)

Add to your `.bashrc` or `.zshrc`:

```bash
# Backend
alias backend="cd ~/path/to/backend && npm run dev"

# Frontend
alias frontend="cd ~/path/to/frontend && npm run dev"

# MongoDB
alias mongostart="brew services start mongodb-community"
alias mongostop="brew services stop mongodb-community"

# Git shortcuts
alias gs="git status"
alias ga="git add ."
alias gc="git commit -m"
alias gp="git push"
```

---

**Quick Help:** Run these commands from the project root directory unless specified otherwise.
