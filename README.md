Install dependencies:
npm install

Start the development server:
npm start

Features:
User registration and login

View list of available cars (with price, type, image)

Book a car for specific dates

Admin dashboard to add/edit/delete cars

JWT-based authentication

API integration with backend

Responsive UI

Folder Structure:
Car-rental/
├── node_modules/           ← created by npm install (not committed to Git)
├── package-lock.json       ← created by npm install (commit to Git)
├── package.json
├── tailwind.config.js     
├── public/
│   └── index.html
├── src/
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── CarList.jsx
│   │   ├── Dashboard.jsx
│   │   └── BookingForm.jsx
│   ├── hooks/
│   │   └── useAuth.js
│   ├── services/
│   │   └── api.js
│   ├── context/
│   │   └── AuthContext.js
│   ├── App.js
│   ├── index.js
│   ├── index.css         
│   └── reportWebVitals.js
    └── App.test.js
    └── App.css


