# 🏠 NestMatch AI

An AI-assisted full-stack web application that helps tenants discover rental properties based on their preferences while enabling property owners to manage and list rental properties. The platform includes secure authentication, profile management, property listing, and compatibility-based recommendations.

---

## 📌 Features

### 👤 Authentication
- User Registration & Login
- JWT-based Authentication
- Role-based Access Control (Tenant / Owner)
- Secure Protected Routes

### 👥 User Profile
- Complete & Edit Profile
- Budget Preferences
- Preferred Location
- Move-in Date
- Lifestyle Preferences
  - Smoking
  - Drinking
  - Pets
  - Sleep Schedule
  - Cleanliness

### 🏡 Property Management
- Create Property Listing
- Edit Property
- Delete Property
- Browse Available Properties
- Property Details Page
- Property Search & Filters

### 🤖 Compatibility Matching
- Preference-based Property Recommendations
- Budget Compatibility
- Location Matching
- Move-in Date Matching
- Lifestyle Compatibility Score
- Recommendation Reasoning

### 🎨 Frontend
- Responsive UI
- Modern Dashboard
- Glassmorphism Design
- Skeleton Loading States
- Empty State Components
- Mobile Responsive Layout

---

# 🛠 Tech Stack

## Frontend
- React.js
- Vite
- Tailwind CSS
- React Router
- Axios
- React Hook Form
- React Hot Toast

## Backend
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT Authentication
- Joi Validation
- Cloudinary (Image Support)

---

# 📂 Project Structure

```
NestMatch-AI
│
├── client
│   ├── src
│   ├── public
│   ├── package.json
│   └── vite.config.js
│
├── server
│   ├── src
│   │   ├── config
│   │   ├── controllers
│   │   ├── middlewares
│   │   ├── models
│   │   ├── repositories
│   │   ├── routes
│   │   ├── services
│   │   ├── utils
│   │   └── validators
│   │
│   └── package.json
│
├── .env.example
├── .gitignore
└── README.md
```

---

# 🚀 Installation

## Clone Repository

```bash
git clone https://github.com/janvee1201/nestmatch-ai.git
cd nestmatch-ai
```

---

## Backend Setup

```bash
cd server
npm install
```

Create a `.env` file using the provided `.env.example`.

Run the backend:

```bash
npm run dev
```

---

## Frontend Setup

```bash
cd client
npm install
npm run dev
```

Frontend:

```
http://localhost:5173
```

Backend:

```
http://localhost:5000
```

---

# 🔑 Environment Variables

Create a `.env` file inside the `server` directory.

Required variables:

```
PORT
NODE_ENV
FRONTEND_URL
MONGO_URI

JWT_SECRET
JWT_EXPIRY

GEMINI_API_KEY

CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET

SMTP_HOST
SMTP_PORT
SMTP_USER
SMTP_PASS
```

---

# 📡 API Modules

### Authentication
- Register
- Login

### Profile
- Get Profile
- Update Profile

### Properties
- Create Property
- Update Property
- Delete Property
- Browse Properties
- Property Details

### Matching
- Compatibility Recommendations

---

# 📱 Screenshots

> Add screenshots of the following pages here:

- Landing Page
- Login
- Register
- Tenant Dashboard
- Owner Dashboard
- Browse Properties
- Property Details
- Recommendations

---

# 🔮 Future Enhancements

- AI-powered roommate recommendation
- Real-time chat between tenant and owner
- Property image upload support
- Email verification
- Password reset
- Google Maps integration
- Favorite properties
- Notification system

---

# 👩‍💻 Author

**Janvee Sahu**

B.Tech Computer Science (AI)

GitHub: https://github.com/janvee1201

---

# 📄 License

This project was developed for educational and assignment purposes.
