# LingoLink - Language Translation Platform

A modern platform for document translation powered by AI and human expertise.

## Project Structure

```
lingolink/
├── client/                 # Frontend React application
│   ├── public/            # Static files
│   └── src/               # React source code
│       ├── components/    # React components
│       ├── pages/         # Page components
│       ├── context/       # React context
│       ├── hooks/         # Custom hooks
│       └── utils/         # Utility functions
│
└── server/                # Backend Node.js application
    ├── config/            # Configuration files
    ├── controllers/       # Route controllers
    ├── middleware/        # Custom middleware
    ├── models/            # Database models
    ├── routes/            # API routes
    └── utils/             # Utility functions
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/lingolink.git
cd lingolink
```

2. Install dependencies for both client and server
```bash
# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

3. Set up environment variables
- Create a `.env` file in the server directory
- Add your MongoDB URI, JWT secret, and other required variables

4. Start the development servers
```bash
# Start the backend server
cd server
npm run dev

# Start the frontend development server
cd ../client
npm start
```

## Features

- User authentication (email/password & Google OAuth)
- Document upload and translation
- Real-time translation status updates
- User dashboard for both clients and translators
- Secure file handling
- Multi-language support

## API Documentation

The API documentation is available at `/api/docs` when running the server.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 