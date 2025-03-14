# ThriftX - Premium Thrift Shopping Platform

ThriftX is a modern e-commerce platform specializing in premium thrifted items. Built with Next.js, TypeScript, and Node.js, it provides a seamless shopping experience for both buyers and sellers.

## Features

- 🛍️ Premium thrift shopping experience
- 👥 User authentication and authorization
- 🏪 Vendor dashboard for sellers
- 👨‍💼 Admin dashboard for management
- 🔍 Advanced search and filtering
- 🛒 Shopping cart functionality
- 💳 Secure payment processing
- 📦 Order tracking and management
- 📱 Responsive design for all devices
- 🔒 Secure and scalable architecture

## Tech Stack

### Frontend
- Next.js 14
- TypeScript
- Tailwind CSS
- React Query
- Zustand (State Management)

### Backend
- Node.js
- Express.js
- TypeScript
- MongoDB
- Mongoose
- JWT Authentication
- Redis (Caching)

### Services
- Cloudinary (Image Storage)
- Stripe (Payment Processing)
- Shippo (Shipping)
- SendGrid (Email)

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB
- Redis
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/thriftx.git
cd thriftx
```

2. Install dependencies:
```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

3. Set up environment variables:
- Copy `.env.example` to `.env` in both `server` and `client` directories
- Update the variables with your values

4. Start the development servers:
```bash
# Start backend server (from server directory)
npm run dev

# Start frontend server (from client directory)
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Project Structure

```
thriftx/
├── client/                 # Frontend Next.js application
│   ├── app/               # Next.js app directory
│   ├── components/        # React components
│   ├── public/           # Static files
│   └── styles/           # Global styles
├── server/               # Backend Node.js application
│   ├── config/          # Configuration files
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Custom middleware
│   ├── models/         # Database models
│   ├── routes/         # API routes
│   └── services/       # Business logic
└── README.md
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [MongoDB](https://www.mongodb.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Express.js](https://expressjs.com/) 