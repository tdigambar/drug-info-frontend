# Drug Info Frontend

React application for viewing and filtering drug information.

## Setup

1. Switch to Node.js 20 (if using nvm):
```bash
nvm use
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The app will open at `http://localhost:3000`

Make sure the backend server is running on `http://localhost:3001`

## Environment Variables

You can set the API URL by creating a `.env` file:
```
REACT_APP_API_URL=http://localhost:3001/api
```

## Testing

Run tests:
```bash
npm test
```

## Features

- Display drug information in a table with configurable columns
- Filter drugs by company (dropdown or click on company in table)
- Launch dates formatted according to user's locale
- Data sorted by descending launch date
