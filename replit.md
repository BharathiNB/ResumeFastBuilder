# ResumeFast - Free Online Resume Builder

## Overview

ResumeFast is a modern, full-stack resume builder application that allows users to create, edit, and export professional resumes for free. The application features comprehensive Google AdSense integration for monetization, React frontend with TypeScript, Express.js backend, and PostgreSQL database with Firebase authentication.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite for build tooling
- **Styling**: Tailwind CSS with shadcn/ui component library for consistent, accessible UI components
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **Authentication**: Firebase Auth with Google OAuth integration

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Runtime**: Node.js with ES modules
- **API Style**: RESTful API with JSON responses
- **Authentication**: Firebase Admin SDK for token verification
- **PDF Generation**: Puppeteer for server-side PDF generation

### Database
- **Primary Database**: PostgreSQL with Drizzle ORM
- **Schema Management**: Drizzle Kit for migrations
- **Connection**: Neon Database serverless PostgreSQL
- **Session Storage**: PostgreSQL sessions with connect-pg-simple

## Key Components

### Monetization System
- **Google AdSense Integration**: Comprehensive ad placement strategy
- **Homepage Ads**: Banner ads and in-article placements
- **Resume Builder Ads**: Top banner and sidebar ads on larger screens
- **Responsive Ad Units**: Optimized for all device sizes
- **Development/Production Toggle**: Placeholders in dev, real ads in production
- **Google Analytics**: User behavior tracking for better ad targeting

### Authentication System
- Firebase Authentication handles user registration and login
- Google OAuth as the primary authentication method
- Firebase Admin SDK verifies tokens on the backend (with development mock fallback)
- Automatic user creation in local database upon first login

### Resume Builder
- Multi-step form interface with real-time preview
- Sections include: Personal Info, Experience, Education, Skills, Projects
- Dynamic addition/removal of experience and education entries
- Auto-save functionality for user convenience
- Three-column layout on large screens (form, preview, ads)

### PDF Export
- Server-side PDF generation using Puppeteer
- Custom HTML template rendering for professional resume layouts
- Download functionality with proper file naming

### SEO & Compliance
- **Privacy Policy**: Required for AdSense compliance
- **SEO Optimization**: Comprehensive meta tags and structured data
- **Google Analytics**: Integrated traffic analysis
- **Mobile-Friendly**: Responsive design for all devices

### Data Models
- **Users**: Firebase UID mapping, profile information
- **Resumes**: JSON-based flexible resume data storage
- **Resume Data**: Structured schema for personal info, experience, education, skills, and projects

## Data Flow

1. **Authentication Flow**:
   - User signs in with Google via Firebase Auth
   - Frontend receives Firebase ID token
   - Backend verifies token and creates/retrieves user record
   - User session maintained through Firebase Auth state

2. **Resume Creation Flow**:
   - User creates new resume or edits existing one
   - Form data updates are handled by React state
   - Save operations send data to backend API
   - Resume data stored as JSON in PostgreSQL

3. **PDF Generation Flow**:
   - User requests PDF export
   - Backend receives resume data
   - Puppeteer generates PDF from HTML template
   - PDF file returned as download

4. **Monetization Flow**:
   - AdSense ads load asynchronously on page visit
   - Google Analytics tracks user behavior and page views
   - Ad revenue generated from user interactions with ads
   - Privacy policy ensures GDPR/CCPA compliance

## External Dependencies

### Authentication
- **Firebase Auth**: User authentication and session management
- **Firebase Admin SDK**: Server-side token verification (with dev mock fallback)

### Monetization & Analytics
- **Google AdSense**: Advertisement serving and revenue generation
- **Google Analytics**: User behavior tracking and site analytics

### Database
- **Neon Database**: Serverless PostgreSQL hosting (fallback to in-memory for dev)
- **Drizzle ORM**: Type-safe database queries and migrations

### PDF Generation
- **Puppeteer**: Headless Chrome for PDF generation

### UI Components
- **Radix UI**: Accessible component primitives
- **shadcn/ui**: Pre-built component library
- **Tailwind CSS**: Utility-first CSS framework with AdSense styling

### Development Tools
- **Vite**: Fast build tool and dev server
- **TypeScript**: Type safety across the application
- **TanStack Query**: Server state management and caching

## Deployment Strategy

The application is configured for development with Replit-specific optimizations:

- **Development**: Uses Vite dev server with hot module replacement
- **Production Build**: 
  - Frontend: Vite builds static assets to `dist/public`
  - Backend: esbuild bundles server code to `dist/index.js`
- **Environment Variables**: Firebase credentials and database URL required
- **Database**: Drizzle migrations handle schema changes
- **Static Assets**: Express serves built frontend in production

### Build Commands
- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run start`: Start production server
- `npm run db:push`: Apply database schema changes

The architecture supports both development and production environments with proper environment variable configuration for Firebase and database credentials.