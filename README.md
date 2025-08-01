# Expense Manager Frontend

A modern React TypeScript frontend for the Expense Manager application with Material-UI components and comprehensive expense tracking features.

## Features

- **User Authentication**: Secure login and registration system
- **Dashboard**: Overview of accounts, recent transactions, and financial summary
- **Account Management**: Create and manage multiple accounts (checking, savings, credit cards, etc.)
- **Transaction Management**: Record and track deposits, withdrawals, and transfers
- **Category & Payee Management**: Organize expenses with customizable categories and payees
- **Reports & Analytics**: Visualize spending patterns and financial trends
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Material-UI**: Modern, accessible UI components

## Tech Stack

- **React 19** - Modern React with latest features
- **TypeScript** - Type-safe development
- **Material-UI (MUI)** - Component library and design system
- **React Query (TanStack Query)** - Data fetching and caching
- **React Hook Form** - Form handling with validation
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **Date-fns** - Date manipulation utilities
- **Yup** - Schema validation

## Prerequisites

- Node.js 16+ and npm
- Backend API running on http://localhost:8000

## Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment setup:**
   Create a `.env` file in the frontend directory:
   ```env
   REACT_APP_API_URL=http://localhost:8000
   ```

4. **Start development server:**
   ```bash
   npm start
   ```

   Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Available Scripts

### `npm start`
Runs the app in development mode with hot reloading.

### `npm test`
Launches the test runner in interactive watch mode.

### `npm run build`
Builds the app for production to the `build` folder.
The build is minified and optimized for best performance.

### `npm run eject`
**Note: This is a one-way operation!**
Removes the single build dependency and copies all configuration files.

## Project Structure

```
frontend/
├── public/                 # Static files
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── Layout.tsx
│   │   ├── LoginForm.tsx
│   │   ├── RegisterForm.tsx
│   │   └── MultiSelectDropdown.tsx
│   ├── contexts/           # React contexts
│   │   └── AuthContext.tsx
│   ├── pages/              # Main application pages
│   │   ├── Dashboard.tsx
│   │   ├── Accounts.tsx
│   │   ├── Transactions.tsx
│   │   ├── Categories.tsx
│   │   ├── Payees.tsx
│   │   ├── Reports.tsx
│   │   └── AuthPage.tsx
│   ├── services/           # API service layer
│   │   ├── api.ts
│   │   └── authApi.ts
│   ├── types/              # TypeScript type definitions
│   │   ├── index.ts
│   │   └── auth.ts
│   ├── utils/              # Utility functions
│   │   └── formatters.ts
│   ├── App.tsx             # Main app component
│   └── index.tsx           # App entry point
├── package.json
├── tsconfig.json
└── README.md
```

## Key Features

### Authentication
- Secure JWT-based authentication
- Login and registration forms with validation
- Protected routes and automatic token refresh
- User context management

### Dashboard
- Financial overview with account balances
- Recent transaction history
- Quick action buttons for common tasks
- Responsive card-based layout

### Accounts
- Multiple account types (checking, savings, credit, cash, investment)
- Account balance tracking
- Account creation and editing with validation
- Visual account type indicators

### Transactions
- Three transaction types: deposits, withdrawals, transfers
- Advanced filtering by date, account, category, payee
- Bulk transaction operations
- Real-time balance updates

### Categories & Payees
- Color-coded expense categories
- Custom category creation
- Payee management for transaction organization
- Quick selection interfaces

### Reports
- Transaction summaries by category, payee, and account
- Monthly trend analysis
- Interactive charts and visualizations
- Exportable data views

## State Management

- **React Query**: Server state management and caching
- **React Context**: User authentication state
- **React Hook Form**: Form state and validation
- **Local State**: Component-specific state with hooks

## API Integration

The frontend communicates with the FastAPI backend through:
- Axios-based HTTP client
- Automatic request/response interceptors
- Error handling and user feedback
- Optimistic updates with React Query

## Authentication Flow

1. User logs in via the AuthPage
2. JWT token stored in localStorage
3. AuthContext provides user state across the app
4. API requests include authorization headers
5. Protected routes redirect to login if unauthenticated

## Responsive Design

- Mobile-first approach
- Material-UI responsive breakpoints
- Adaptive navigation (drawer on mobile, persistent on desktop)
- Touch-friendly interfaces

## Development Guidelines

### Adding New Pages
1. Create component in `src/pages/`
2. Add route in `App.tsx`
3. Update navigation in `Layout.tsx`
4. Add corresponding types in `src/types/`

### API Integration
1. Add service functions in `src/services/`
2. Use React Query hooks for data fetching
3. Handle loading and error states
4. Implement optimistic updates where appropriate

### Styling
- Use Material-UI components and theme
- Follow Material Design principles
- Use sx prop for component-specific styles
- Maintain consistent spacing and typography

## Building for Production

```bash
npm run build
```

This creates an optimized production build in the `build/` folder.

### Deployment Options

- **Static Hosting**: Deploy to services like Netlify, Vercel, or GitHub Pages
- **CDN**: Upload build files to a CDN
- **Docker**: Containerize with nginx for production serving

## Environment Variables

- `REACT_APP_API_URL`: Backend API base URL (default: http://localhost:8000)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Follow TypeScript best practices
2. Use React hooks and functional components
3. Implement proper error handling
4. Add tests for new features
5. Follow Material-UI design guidelines

## License

[Add your license information here]
