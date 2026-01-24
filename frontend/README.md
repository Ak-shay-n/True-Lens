# True Lens Frontend

Modern React-based frontend for the True Lens image authentication platform, featuring an Adobe-inspired UI design.

## Features

- 🎨 **Adobe-Style Design** - Clean, modern UI with smooth animations
- 🔐 **Authentication** - Secure registration and login system
- 📤 **Image Upload** - Upload images to create blockchain attestations
- ✅ **Image Verification** - Verify image authenticity against blockchain records
- 🔒 **Protected Routes** - Authentication-based access control
- 📱 **Responsive Design** - Works seamlessly on all devices

## Tech Stack

- **React 18** - UI library
- **React Router v6** - Navigation and routing
- **Axios** - HTTP client for API requests
- **Vite** - Fast build tool and dev server
- **CSS3** - Modern styling with CSS variables

## Prerequisites

- Node.js 16+ and npm
- Backend server running on port 5000

## Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx          # Navigation component
│   │   └── Navbar.css
│   ├── pages/
│   │   ├── Home.jsx             # Landing page
│   │   ├── Home.css
│   │   ├── Login.jsx            # Login page
│   │   ├── Register.jsx         # Registration page
│   │   ├── Auth.css             # Shared auth styles
│   │   ├── Upload.jsx           # Image upload page
│   │   ├── Upload.css
│   │   ├── Verify.jsx           # Image verification page
│   │   └── Verify.css
│   ├── services/
│   │   ├── api.js               # Axios instance and interceptors
│   │   └── auth.js              # Authentication utilities
│   ├── App.jsx                  # Main app with routing
│   ├── main.jsx                 # Application entry point
│   └── index.css                # Global styles
├── index.html
├── vite.config.js
└── package.json
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## User Flow

1. **Landing Page** - Users arrive at the home page showcasing platform features
2. **Registration** - New users must register with email and password
3. **Login** - Registered users can log in to access protected features
4. **Upload** - Authenticated users can upload images for blockchain attestation
5. **Verify** - Anyone can verify if an image exists in the blockchain registry

## Authentication

- JWT-based authentication
- Tokens stored in localStorage
- Auto-login after registration
- Protected routes redirect to login if not authenticated
- Automatic token inclusion in API requests

## API Integration

The frontend expects the backend API to be running on `http://localhost:5000` with the following endpoints:

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/images/upload` - Image upload (requires authentication)
- `POST /api/verify` - Image verification (public)

## Design Philosophy

The UI follows Adobe's design principles:

- **Clean & Minimal** - Focus on content, minimal distractions
- **Consistent Spacing** - Using CSS variables for spacing scale
- **Professional Typography** - Inter font family for readability
- **Smooth Animations** - Subtle transitions for better UX
- **Accessible Colors** - High contrast for readability
- **Responsive Layout** - Mobile-first approach

## Color Palette

- Primary: `#1473E6` (Adobe Blue)
- Text Primary: `#2C2C2C`
- Text Secondary: `#6E6E6E`
- Success: `#268E6C`
- Error: `#E34850`
- Warning: `#E68619`

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## Contributing

When adding new features:

1. Follow the existing component structure
2. Use CSS variables for colors and spacing
3. Ensure mobile responsiveness
4. Add error handling for API calls
5. Maintain accessibility standards

## License

Part of the True Lens project.
