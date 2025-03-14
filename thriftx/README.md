# ThriftX - Multi-Vendor E-Commerce Platform

ThriftX is a modern multi-vendor e-commerce platform built with the MERN stack (MongoDB, Express, React, Node.js) and enhanced with various modern features.

## Features

- **Multi-vendor System**: Vendors can register and manage their own product listings
- **Role-based Authentication**: Admin, Vendor, and Customer roles with specific permissions
- **Product Management**: Support for product variants (size, color, material)
- **Payment Processing**: Secure payment processing with Stripe
- **Order Tracking**: Package tracking integration with delivery APIs
- **Sales Analytics**: Real-time sales statistics and dashboards
- **Advanced Search**: Filter products by various attributes
- **AI-Powered Features**: Auto-enhancement of product photos and virtual try-on capabilities

## Tech Stack

### Frontend
- Next.js (React framework with SSR/SEO capabilities)
- TypeScript
- Tailwind CSS
- Redux Toolkit for state management

### Backend
- Node.js with Express
- TypeScript
- MongoDB with Mongoose
- JWT for authentication
- Stripe for payment processing
- Cloudinary for image management

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/thriftx.git
cd thriftx
```

2. Install backend dependencies
```bash
cd backend
npm install
```

3. Install frontend dependencies
```bash
cd ../frontend
npm install
```

4. Set up environment variables
   - Create a `.env` file in the backend directory based on the `.env.example` file
   - Set up your MongoDB connection string, JWT secret, and other required variables

5. Run the development servers

Backend:
```bash
cd backend
npm run dev
```

Frontend:
```bash
cd frontend
npm run dev
```

6. Access the application
   - Backend API: http://localhost:5000
   - Frontend: http://localhost:3000

## Project Structure

```
thriftx/
├── backend/                # Node.js backend
│   ├── src/
│   │   ├── config/         # Configuration files
│   │   ├── controllers/    # Route controllers
│   │   ├── middlewares/    # Custom middlewares
│   │   ├── models/         # Mongoose models
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   ├── utils/          # Utility functions
│   │   └── server.ts       # Entry point
│   ├── .env                # Environment variables
│   └── package.json        # Backend dependencies
│
└── frontend/              # Next.js frontend
    ├── public/            # Static files
    ├── src/
    │   ├── app/           # Next.js app router
    │   ├── components/    # React components
    │   ├── context/       # React context
    │   ├── hooks/         # Custom hooks
    │   ├── lib/           # Utility functions
    │   ├── services/      # API services
    │   └── styles/        # Global styles
    └── package.json       # Frontend dependencies
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Stripe](https://stripe.com/) 