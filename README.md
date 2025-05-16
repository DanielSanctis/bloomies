# Bloomies - Synthetic Floral Arrangements

An e-commerce website for synthetic floral arrangements built with React, TypeScript, Vite, and Firebase.

## Features

- Browse and purchase synthetic floral arrangements
- User authentication with email/password and Google Sign-In
- Shopping cart and wishlist functionality
- Custom bouquet creation
- Responsive design for all devices

## Technologies Used

- React with TypeScript
- Vite for fast development and building
- Tailwind CSS for styling
- Firebase for authentication and data storage
- Wouter for routing

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/bloomies.git
   cd bloomies
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn
   ```

3. Set up Firebase (see Firebase Setup section below)

4. Create a `.env` file in the root directory with your Firebase configuration (copy from `.env.example`)
   ```
   VITE_FIREBASE_API_KEY=your-api-key
   VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
   VITE_FIREBASE_APP_ID=your-app-id
   VITE_FIREBASE_MEASUREMENT_ID=your-measurement-id
   ```

5. Start the development server
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. Open your browser and navigate to `http://localhost:5173`

## Firebase Setup

This project uses Firebase for authentication and data storage. Follow these steps to set up Firebase:

1. Create a Firebase project
   - Go to the [Firebase Console](https://console.firebase.google.com/)
   - Click "Add project" and follow the setup wizard
   - Name your project (e.g., "Bloomies")

2. Set up Firebase Authentication
   - In your Firebase project, go to "Authentication" in the left sidebar
   - Click "Get started"
   - Enable the authentication methods you want to use:
     - Email/Password (required)
     - Google (optional, for Google Sign-In)
   - Follow the setup instructions for each method

3. Register your web app
   - In your Firebase project, click the gear icon (⚙️) next to "Project Overview"
   - Select "Project settings"
   - Scroll down to "Your apps" and click the web icon (</>)
   - Register your app with a name (e.g., "Bloomies Web")
   - Copy the Firebase configuration values

4. Update your `.env` file
   - Create a `.env` file in the root directory if it doesn't exist
   - Add your Firebase configuration values (see step 4 in Installation)

5. Set up Firestore Database
   - In your Firebase project, go to "Firestore Database" in the left sidebar
   - Click "Create database"
   - Choose "Start in production mode" or "Start in test mode" (for development)
   - Select a location for your database
   - The database will be automatically used by the application

6. Set up Firebase Storage
   - In your Firebase project, go to "Storage" in the left sidebar
   - Click "Get started"
   - Follow the setup wizard
   - The storage will be used for product images and custom bouquet inspiration images

7. Deploy Firestore Security Rules
   - Install Firebase CLI: `npm install -g firebase-tools`
   - Login to Firebase: `firebase login`
   - Initialize Firebase in your project: `firebase init`
   - Select Firestore and Storage when prompted
   - Deploy the security rules:
     ```bash
     firebase deploy --only firestore:rules
     firebase deploy --only storage:rules
     ```

## Development

### Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the production version
- `npm run preview` - Preview the production build locally
- `npm run migrate-products` - Migrate products from static data to Firestore
- `npm run migrate-products -- --force` - Force overwrite existing products in Firestore

### Backend Features

The backend of Bloomies is built with Firebase and includes the following core features:

1. **User Authentication**
   - Email/password authentication
   - Google sign-in
   - Password reset

2. **User Profile Management**
   - Store and update user details
   - Manage shipping addresses

3. **Orders**
   - Create and track orders
   - View order history
   - Update order status

4. **Payment Information**
   - Store payment method details
   - Track payment status

### Data Migration

To migrate the sample product data to Firestore, run:

```bash
npm install dotenv
npm run migrate-products
```

This will upload sample products to Firestore. If products already exist in Firestore, the migration will be aborted. To force overwrite existing products, use:

```bash
npm run migrate-products -- --force
```

**Important**: Before running the migration script:
1. Make sure you have set up your Firebase configuration in the `.env` file
2. The script uses a simplified product dataset for demonstration purposes
3. The script will also create an admin user in the admins collection if one doesn't exist
