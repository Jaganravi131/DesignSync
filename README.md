# DesignSync - Real-time Collaborative Design Platform

A comprehensive real-time collaborative design platform built with React, Node.js, and Socket.io. Create stunning designs with your team in real-time with features like live collaboration, version history, comments, and export capabilities.

## 🚀 Features

### Core Features
- **Real-time Collaboration**: Multiple users can edit designs simultaneously with live cursor tracking
- **Template Library**: 20+ professionally designed templates across multiple categories
- **Live Preview**: See changes instantly as you design
- **Auto-save & Version History**: Never lose your work with automatic saving and version control
- **Export Options**: Export designs as PNG, JPG, or PDF
- **Comments System**: Add contextual comments and feedback directly on designs
- **Responsive Design**: Works seamlessly across desktop, tablet, and mobile devices

### Template Categories
- **Social Media**: Instagram posts, Facebook covers, LinkedIn banners
- **Business**: Business cards, presentations, corporate materials
- **Marketing**: Flyers, banners, promotional materials
- **Personal**: Custom designs for personal use

### Technical Features
- **WebSocket Integration**: Real-time data synchronization using Socket.io
- **MongoDB Database**: Scalable document storage for designs and user data
- **JWT Authentication**: Secure user authentication and authorization
- **Image Processing**: Cloudinary integration for image optimization
- **RESTful API**: Well-structured API endpoints for all operations

## 🛠 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Socket.io Client** for real-time features
- **React Router** for navigation
- **Axios** for API calls
- **React Hot Toast** for notifications
- **Framer Motion** for animations

### Backend
- **Node.js** with Express
- **Socket.io** for real-time communication
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Multer** for file uploads
- **CORS** for cross-origin requests

### Development Tools
- **Vite** for fast development and building
- **ESLint** for code linting
- **Concurrently** for running multiple processes
- **Nodemon** for auto-restarting server

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas account)

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd design-sync-platform
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup

Create a `.env` file in the root directory and configure the following variables:

```env
# Client Environment Variables
VITE_API_URL=http://localhost:3001
VITE_SOCKET_URL=http://localhost:3001
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_API_KEY=your_api_key
VITE_AUTH0_DOMAIN=your_auth0_domain
VITE_AUTH0_CLIENT_ID=your_auth0_client_id

# Server Environment Variables
PORT=3001
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/designsync
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_BUCKET_NAME=your_s3_bucket_name
AWS_REGION=us-east-1
```

### 4. Start the Application
```bash
npm run dev
```

This will start both the client (http://localhost:5173) and server (http://localhost:3001) concurrently.

## 🔧 API Integration Setup

### MongoDB Atlas Setup
1. Create a MongoDB Atlas account at https://www.mongodb.com/atlas
2. Create a new cluster
3. Create a database user with read/write permissions
4. Get your connection string and add it to `MONGODB_URI`
5. Whitelist your IP address or use 0.0.0.0/0 for development

### Cloudinary Setup (Optional - for image processing)
1. Sign up at https://cloudinary.com
2. Go to your dashboard and copy:
   - Cloud Name
   - API Key
   - API Secret
3. Set up upload presets in your Cloudinary console
4. Add credentials to your `.env` file

### AWS S3 Setup (Optional - for file storage)
1. Create an AWS account
2. Create an S3 bucket
3. Create IAM user with S3 permissions
4. Generate access keys
5. Configure CORS for your bucket:
```json
[
    {
        "AllowedHeaders": ["*"],
        "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
        "AllowedOrigins": ["*"],
        "ExposeHeaders": []
    }
]
```

## 📁 Project Structure

```
design-sync-platform/
├── server/                 # Backend server
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   └── index.js           # Server entry point
├── src/                   # Frontend source
│   ├── components/        # React components
│   ├── contexts/          # React contexts
│   ├── pages/            # Page components
│   └── App.tsx           # Main app component
├── public/               # Static assets
└── package.json          # Dependencies and scripts
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/login` - User login/registration
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/preferences` - Update user preferences

### Designs
- `GET /api/designs` - Get user's designs
- `GET /api/designs/:id` - Get specific design
- `POST /api/designs` - Create new design
- `PUT /api/designs/:id` - Update design
- `DELETE /api/designs/:id` - Delete design
- `POST /api/designs/:id/versions` - Save design version

### Templates
- `GET /api/templates` - Get all templates
- `GET /api/templates/:id` - Get specific template
- `GET /api/templates/categories/list` - Get template categories

### Collaboration
- `GET /api/collaboration/activity/:designId` - Get design activity
- `POST /api/collaboration/invite` - Invite collaborator
- `DELETE /api/collaboration/collaborator/:designId/:userId` - Remove collaborator

## 🔄 Real-time Events

### Socket.io Events

#### Client to Server
- `join-design` - Join a design room for collaboration
- `design-update` - Send design updates to other users
- `cursor-move` - Send cursor position updates
- `element-select` - Notify element selection
- `add-comment` - Add a comment to the design

#### Server to Client
- `user-joined` - User joined the design session
- `user-left` - User left the design session
- `active-users` - List of currently active users
- `design-updated` - Design was updated by another user
- `cursor-moved` - Another user's cursor moved
- `element-selected` - Another user selected an element
- `comment-added` - New comment was added

## 🚀 Deployment

### Frontend Deployment (Vercel/Netlify)
1. Build the project: `npm run build`
2. Deploy the `dist` folder to your hosting provider
3. Configure environment variables in your hosting dashboard

### Backend Deployment (Railway/Heroku/DigitalOcean)
1. Set up your hosting environment
2. Configure environment variables
3. Deploy the server code
4. Ensure MongoDB connection is properly configured

### Environment Variables for Production
Make sure to set all required environment variables in your production environment:
- Database connection strings
- API keys for third-party services
- JWT secrets
- CORS origins (set to your frontend domain)

## 🧪 Testing

### Running Tests
```bash
# Run frontend tests
npm run test

# Run backend tests
npm run test:server
```

### Manual Testing Checklist
- [ ] User registration and login
- [ ] Design creation and editing
- [ ] Real-time collaboration
- [ ] Template usage
- [ ] Export functionality
- [ ] Comments system
- [ ] Version history

## 🔒 Security Considerations

### Authentication
- JWT tokens with expiration
- Secure password handling
- Rate limiting on API endpoints

### Data Protection
- Input validation and sanitization
- CORS configuration
- Environment variable protection
- Database connection security

### Real-time Security
- Socket authentication
- Room-based access control
- User permission validation

## 📈 Performance Optimization

### Frontend
- Code splitting with React.lazy
- Image optimization with Cloudinary
- Efficient re-rendering with React.memo
- Virtual scrolling for large lists

### Backend
- Database indexing
- Connection pooling
- Caching with Redis (optional)
- File compression

### Real-time
- Efficient event handling
- Debounced updates
- Connection management
- Memory leak prevention

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit your changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the existing issues in the repository
2. Create a new issue with detailed information
3. Include steps to reproduce the problem
4. Provide relevant error messages and logs

## 🔮 Future Enhancements

- [ ] Advanced animation tools
- [ ] Video export capabilities
- [ ] AI-powered design suggestions
- [ ] Advanced collaboration features (voice/video chat)
- [ ] Mobile app development
- [ ] Advanced template marketplace
- [ ] Integration with design systems
- [ ] Advanced analytics and insights

---

Built with ❤️ using React, Node.js, and Socket.io