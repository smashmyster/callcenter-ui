# Call Center UI

A modern, responsive Next.js frontend application for AI-powered call center operations. Built with React 19, TypeScript, and Tailwind CSS, featuring real-time chat, document management, and analytics dashboards.

## 🚀 Features

- **Real-time Chat Interface**: WebSocket-powered chat with AI assistance
- **Document Management**: Upload, view, and manage policy documents
- **Call Analytics**: Visual dashboards with call statistics and insights
- **File Upload**: Drag-and-drop file upload with progress tracking
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Authentication**: Secure login and protected routes
- **Search Functionality**: Advanced search across calls and documents
- **JIRA Integration**: Ticket management and tracking
- **Markdown Support**: Rich text rendering with syntax highlighting

## 🛠️ Tech Stack

- **Framework**: Next.js 15.5.4 with App Router
- **React**: React 19.1.0
- **Styling**: Tailwind CSS 4.x
- **TypeScript**: Full TypeScript support
- **State Management**: React Context + SWR for data fetching
- **WebSockets**: Socket.IO client for real-time communication
- **Charts**: Recharts for data visualization
- **Markdown**: React Markdown with syntax highlighting
- **Icons**: Lucide React icons

## 📋 Prerequisites

- Node.js (v18 or higher)
- Yarn package manager
- Backend API running (ai-copilot)

## 🚀 Getting Started

### 1. Installation

```bash
# Install dependencies
yarn install

# Copy environment variables
cp .env.example .env.local
```

### 2. Environment Configuration

Create a `.env.local` file with the following variables:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8787
NEXT_PUBLIC_SOCKET_URL=http://localhost:8787

# Application Configuration
NEXT_PUBLIC_APP_NAME=Call Center UI
NEXT_PUBLIC_APP_VERSION=1.0.0
```

### 3. Development

```bash
# Start development server with Turbopack
yarn dev

# Start on custom port
yarn dev -- -p 3001
```

### 4. Production

```bash
# Build the application
yarn build

# Start production server
yarn start
```

## 📁 Project Structure

```
src/
├── app/                        # Next.js App Router
│   ├── (dashboard)/           # Dashboard route group
│   │   ├── chat/              # Chat interface
│   │   │   ├── [id]/          # Dynamic chat routes
│   │   │   └── page.tsx       # Chat list page
│   │   ├── dashboard/         # Main dashboard
│   │   ├── documents/         # Document management
│   │   ├── history/           # Call history
│   │   ├── policies/          # Policy documents
│   │   ├── settings/          # User settings
│   │   └── layout.tsx         # Dashboard layout
│   ├── login/                 # Authentication
│   ├── globals.css           # Global styles
│   └── layout.tsx            # Root layout
├── components/                # Reusable components
│   ├── AppLayout.tsx         # Main app layout
│   ├── ChatMessages.tsx      # Chat message display
│   ├── FileUpload.tsx        # File upload component
│   ├── Sidebar.tsx           # Navigation sidebar
│   ├── TopBar.tsx            # Top navigation bar
│   └── ...
├── context/                   # React Context providers
│   ├── AuthContext.tsx       # Authentication context
│   └── SocketContext.tsx     # WebSocket context
├── hooks/                     # Custom React hooks
│   ├── useCalls.ts          # Call data management
│   ├── useDocuments.ts      # Document operations
│   ├── useFileUpload.ts     # File upload logic
│   └── useSearch.ts         # Search functionality
├── types/                     # TypeScript type definitions
│   ├── index.ts             # Main type exports
│   └── constants.ts         # Application constants
└── utils/                     # Utility functions
    └── apiClient.ts         # API client configuration
```

## 🎨 UI Components

### Core Components

- **AppLayout**: Main application layout with sidebar and top bar
- **ChatMessages**: Real-time chat message display with markdown support
- **FileUpload**: Drag-and-drop file upload with progress tracking
- **Sidebar**: Navigation sidebar with route management
- **TopBar**: Top navigation with user menu and notifications
- **SearchResults**: Advanced search results display
- **DocumentCard**: Document preview and management cards

### Specialized Components

- **CallsTab**: Call analytics and management interface
- **JiraTicketsTab**: JIRA ticket integration and management
- **ToolsMenu**: AI tools and utilities menu
- **DragDropWrapper**: File drag-and-drop functionality
- **FilePicker**: File selection interface
- **Markdown**: Rich text rendering with syntax highlighting

## 🔌 API Integration

### Authentication
```typescript
// Login user
const { login } = useAuth();
await login(email, password);

// Check authentication status
const { user, isAuthenticated } = useAuth();
```

### Real-time Communication
```typescript
// Socket connection
const { socket, isConnected } = useSocket();

// Send message
socket.emit('send-message', { content, conversationId });

// Listen for messages
socket.on('new-message', (message) => {
  // Handle incoming message
});
```

### Data Fetching
```typescript
// Fetch calls with SWR
const { data: calls, error } = useSWR('/api/calls', fetcher);

// Fetch documents
const { documents, loading } = useDocuments();

// Search functionality
const { search, results } = useSearch();
```

## 🎯 Key Features

### 1. Real-time Chat
- WebSocket-powered real-time messaging
- Markdown support with syntax highlighting
- File attachment support
- Message history and persistence

### 2. Document Management
- Upload multiple file formats
- Document preview and management
- Search and filter capabilities
- Version control and history

### 3. Call Analytics
- Interactive charts and graphs
- Call statistics and metrics
- Search and filter functionality
- Export capabilities

### 4. File Upload
- Drag-and-drop interface
- Progress tracking
- Multiple file support
- File type validation

## 🔒 Authentication & Security

- JWT-based authentication
- Protected routes with middleware
- Secure API communication
- Input validation and sanitization

## 📱 Responsive Design

The application is fully responsive with:
- Mobile-first design approach
- Tablet and desktop optimizations
- Touch-friendly interfaces
- Adaptive layouts

## 🧪 Testing

```bash
# Run linting
yarn lint

# Type checking
yarn type-check

# Build verification
yarn build
```

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production deployment
vercel --prod
```

### Environment Variables for Production

```env
NEXT_PUBLIC_API_URL=https://your-api-domain.com
NEXT_PUBLIC_SOCKET_URL=https://your-api-domain.com
NEXT_PUBLIC_APP_NAME=Call Center UI
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN yarn install
COPY . .
RUN yarn build
EXPOSE 3000
CMD ["yarn", "start"]
```

## 🎨 Styling & Theming

The application uses Tailwind CSS with:
- Custom color palette
- Responsive breakpoints
- Dark/light mode support
- Component-based styling
- Utility-first approach

## 🔧 Available Scripts

```bash
# Development
yarn dev              # Start development server with Turbopack
yarn dev --turbopack  # Explicit Turbopack usage

# Building
yarn build            # Build for production with Turbopack
yarn start            # Start production server on port 4001

# Code Quality
yarn lint             # Run ESLint
```

## 📊 Performance

- **Turbopack**: Fast development builds
- **Code Splitting**: Automatic route-based splitting
- **Image Optimization**: Next.js Image component
- **Bundle Analysis**: Built-in bundle analyzer
- **SWR Caching**: Efficient data fetching and caching

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the UNLICENSED License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation for common issues
- Contact the development team

## 🔄 Changelog

### v0.1.0
- Initial release
- Real-time chat interface
- Document management
- Call analytics dashboard
- File upload functionality
- Responsive design
- Authentication system