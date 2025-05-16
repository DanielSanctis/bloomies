# Bloomies - Handcrafted Forever Bouquets

![Bloomies Logo](public/bloomies-logo.svg)

An elegant e-commerce website for handcrafted forever bouquets built with React, TypeScript, Vite, and Firebase. Bloomies offers beautiful synthetic floral arrangements that last a lifetime.

## ✨ Features

- **Product Browsing**: Shop by product or category (occasion, fandom)
- **User Authentication**: Secure login with email/password and Google Sign-In
- **User Profiles**: Manage personal information and view order history
- **Shopping Cart**: Add products, customize quantities, and checkout
- **Wishlist**: Save favorite products for later
- **Custom Bouquets**: Create personalized arrangements
- **Google Pay Integration**: Seamless checkout experience
- **Responsive Design**: Beautiful experience on all devices
- **Product Search**: Find products quickly with search functionality
- **Image Gallery**: View multiple product images with hover effects

## 🛠️ Technologies Used

- **Frontend**:
  - React 18 with TypeScript
  - Vite for fast development and building
  - Tailwind CSS for elegant, responsive styling
  - Wouter for lightweight routing
  - React Query for data fetching and caching

- **Backend & Infrastructure**:
  - Firebase Authentication for user management
  - Firestore for database storage
  - Firebase Storage for image storage
  - Firebase Security Rules for data protection

- **Payment Processing**:
  - Google Pay integration for secure checkout

- **Development Tools**:
  - ESLint for code quality
  - Git & GitHub for version control
  - npm for package management

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Git
- A Firebase account (free tier works for development)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/DanielSanctis/bloomies.git
   cd bloomies
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase** (see detailed Firebase Setup section below)

4. **Configure environment variables**
   - Copy the `.env.example` file to create a new `.env` file
   ```bash
   cp .env.example .env
   ```
   - Update the `.env` file with your Firebase configuration
   ```
   VITE_FIREBASE_API_KEY=your-api-key
   VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
   VITE_FIREBASE_APP_ID=your-app-id
   VITE_FIREBASE_MEASUREMENT_ID=your-measurement-id
   ```

5. **Migrate sample products to Firestore**
   ```bash
   npm run migrate-products
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser** and navigate to `http://localhost:5173` or the port shown in your terminal

### Demo Credentials

For testing purposes, you can use these demo credentials:

- **Email**: demo@bloomies.com
- **Password**: Bloomies123

Or create your own account using the Sign Up feature.

## 🔥 Firebase Setup

This project uses Firebase for authentication, database, and storage. Follow these steps to set up your Firebase project:

### 1. Create a Firebase Project

- Go to the [Firebase Console](https://console.firebase.google.com/)
- Click "Add project" and follow the setup wizard
- Name your project (e.g., "Bloomies")
- Enable Google Analytics if desired (optional)
- Click "Create project"

### 2. Set up Firebase Authentication

- In your Firebase project, go to "Authentication" in the left sidebar
- Click "Get started"
- Enable the following authentication methods:
  - **Email/Password** (required)
    - Toggle the "Email/Password" option to "Enabled"
  - **Google** (optional, for Google Sign-In)
    - Toggle the "Google" option to "Enabled"
    - Configure your OAuth consent screen if prompted
- Click "Save"

### 3. Register Your Web App

- In your Firebase project, click the web icon (`</>`) on the project overview page
- Register your app with a name (e.g., "Bloomies Web")
- You don't need to set up Firebase Hosting for development
- Copy the Firebase configuration values for your `.env` file

### 4. Set up Firestore Database

- In your Firebase project, go to "Firestore Database" in the left sidebar
- Click "Create database"
- Choose "Start in production mode" (recommended) or "Start in test mode" (for quick development)
- Select a location for your database (choose a region close to your target users)
- Click "Enable"

### 5. Set up Firebase Storage

- In your Firebase project, go to "Storage" in the left sidebar
- Click "Get started"
- Accept the default security rules for now (we'll update them later)
- Select the same location as your Firestore database
- Click "Done"

### 6. Deploy Security Rules

- Install Firebase CLI globally:
  ```bash
  npm install -g firebase-tools
  ```
- Login to Firebase:
  ```bash
  firebase login
  ```
- Initialize Firebase in your project:
  ```bash
  firebase init
  ```
  - Select "Firestore" and "Storage" when prompted
  - Choose your Firebase project
  - Accept the default file names for security rules
- Deploy the security rules:
  ```bash
  firebase deploy --only firestore:rules
  firebase deploy --only storage:rules
  ```

### 7. Create an Admin User

The migration script will automatically create an admin user in the Firestore database. To associate it with your account:

1. Sign up in the application with your email
2. Go to Firestore Database in Firebase Console
3. Find the "admins" collection
4. Edit the document to include your user ID (found in the "users" collection)

## 💻 Development

### Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the production version
- `npm run preview` - Preview the production build locally
- `npm run migrate-products` - Migrate products from static data to Firestore
- `npm run migrate-products -- --force` - Force overwrite existing products in Firestore

### Project Structure

```
bloomies/
├── public/               # Static assets
│   ├── images/           # Product images
│   └── favicon.svg       # Site favicon
├── src/
│   ├── assets/           # Internal assets
│   ├── components/       # Reusable UI components
│   │   ├── cart/         # Cart-related components
│   │   ├── layout/       # Layout components (header, footer)
│   │   ├── shop/         # Shop components
│   │   ├── ui/           # Generic UI components
│   │   └── wishlist/     # Wishlist components
│   ├── context/          # React context providers
│   ├── data/             # Static data
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Library configurations
│   ├── pages/            # Page components
│   ├── services/         # Firebase service functions
│   ├── styles/           # Global styles
│   ├── utils/            # Utility functions
│   ├── App.tsx           # Main App component
│   └── main.tsx          # Entry point
├── .env.example          # Example environment variables
├── firebase.json         # Firebase configuration
├── firestore.rules       # Firestore security rules
├── storage.rules         # Storage security rules
├── migrate-products.cjs  # Data migration script
└── package.json          # Project dependencies
```

### Core Features

#### 1. User Authentication & Profiles

- Email/password and Google sign-in
- Profile management with image upload
- Address management for shipping

#### 2. Product Browsing & Search

- Browse by product or category
- Filter by type, size, occasion, and fandom
- Search functionality
- Product detail pages with image galleries

#### 3. Shopping Experience

- Add to cart with quantity selection
- Wishlist functionality
- Product comparison
- Personalized messages for products

#### 4. Checkout & Orders

- Google Pay integration
- Order tracking and history
- Order confirmation
- Multiple payment methods

#### 5. Admin Features

- Product management
- Order management
- User management

### Data Migration

The project includes a migration script to populate Firestore with sample products:

```bash
npm run migrate-products
```

This uploads sample products and creates an admin user. To force overwrite existing products:

```bash
npm run migrate-products -- --force
```

## 🌐 Deployment

### Building for Production

1. Build the production version:
   ```bash
   npm run build
   ```

2. Preview the production build locally:
   ```bash
   npm run preview
   ```

### Deploying to Firebase Hosting

1. Install Firebase CLI if you haven't already:
   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```bash
   firebase login
   ```

3. Initialize Firebase Hosting:
   ```bash
   firebase init hosting
   ```
   - Select your Firebase project
   - Specify `dist` as your public directory
   - Configure as a single-page app
   - Don't overwrite `index.html`

4. Deploy to Firebase Hosting:
   ```bash
   firebase deploy --only hosting
   ```

## 📱 Screenshots

![Home Page](public/images/forget-me-nots.jpg)
*Home page with featured products*

![Product Detail](public/images/lights.jpg)
*Product detail page with customization options*

![Shopping Cart](public/images/gift-wrap.jpg)
*Shopping cart with checkout options*

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📧 Contact

Daniel Sanctis - [GitHub](https://github.com/DanielSanctis)

Project Link: [https://github.com/DanielSanctis/bloomies](https://github.com/DanielSanctis/bloomies)
