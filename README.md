# 🎬 MovieMind AI

> **Professional Movie Discovery Platform** - A comprehensive entertainment discovery app with advanced watchlist management, analytics, and intelligent recommendations.

![Project Status](https://img.shields.io/badge/Status-Production%20Ready-green)
![React](https://img.shields.io/badge/React-18.2.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue)
![Build](https://img.shields.io/badge/Build-Passing-brightgreen)


## 📚 Table of Contents
- [Live Demo](#-live-demo)
- [Screenshots](#-screenshots)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Quick Start](#-quick-start)
- [Project Structure](#-project-structure)
- [Feature Highlights](#-feature-highlights)
- [Performance Features](#-performance-features)
- [Design System](#-design-system)
- [Quality Assurance](#-quality-assurance)
- [Technical Metrics](#-technical-metrics)
- [Deployment](#-deployment)
- [License](#-license)
- [Acknowledgments](#-acknowledgments)


## 📱 Live Demo

**Development Server**: `http://localhost:3000`

## 📸 Screenshots

### 1. Dashboard & Home Page

<div align="left">
  <table>
    <tr>
      <td align="center"><b>Dark Mode</b></td>
      <td align="center"><b>Light Mode</b></td>
    </tr>
    <tr>
      <td>
        <img src="src/assets/images/movieai_home_dark.png" alt="Home - Dark Mode" width="300"/>
      </td>
      <td>
        <img src="src/assets/images/movieai_home_light.png" alt="Home - Light Mode" width="300"/>
      </td>
    </tr>
  </table>
</div>


### 2. Trending Movies

<div align="left">
  <table>
    <tr>
      <td align="center"><b>Dark Mode</b></td>
      <td align="center"><b>Light Mode</b></td>
    </tr>
    <tr>
      <td>
        <img src="src/assets/images/movieai_trending_dark.png" alt="Trending - Dark Mode" width="300"/>
      </td>
      <td>
        <img src="src/assets/images/movieai_trending_light.png" alt="Trending - Light Mode" width="300"/>
      </td>
    </tr>
  </table>
</div>


### 3. Watch List

<div align="left">
  <table>
    <tr>
      <td align="center"><b>Dark Mode</b></td>
      <td align="center"><b>Light Mode</b></td>
    </tr>
    <tr>
      <td>
        <img src="src/assets/images/movieai_watchlist_dark.png" alt="Watchlist - Dark Mode" width="300"/>
      </td>
      <td>
        <img src="src/assets/images/movieai_watchlist_light.png" alt="Watchlist - Light Mode" width="300"/>
      </td>
    </tr>
  </table>
</div>

### 4. Movie Statistics

<div align="left">
  <table>
    <tr>
      <td align="center"><b>Dark Mode</b></td>
      <td align="center"><b>Light Mode</b></td>
    </tr>
    <tr>
      <td>
        <img src="src/assets/images/movieai_stats_dark.png" alt="Statistics - Dark Mode" width="300"/>
      </td>
      <td>
        <img src="src/assets/images/movieai_stats_light.png" alt="Statistics - Light Mode" width="300"/>
      </td>
    </tr>
  </table>
</div>



## 🌟 Key Features

### 🔍 Smart Discovery
- **Real-time Search** with debounced input and instant results
- **Advanced Filtering** by genre, year, rating, and popularity
- **Trending Dashboard** with popular movies and TV shows
- **Intelligent Recommendations** based on viewing history and preferences

### 📚 Advanced Watchlist Management
- **4 Categories**: To Watch, Watching, Watched, Favorites
- **Drag & Drop** interface for easy organization
- **Personal Ratings** with 10-star system
- **Custom Notes** for each movie
- **Priority System** (High/Medium/Low) with visual indicators
- **Tags System** for custom organization
- **Export/Import** data as JSON for backup and sync

### 📊 Analytics Dashboard
- **Visual Charts** showing viewing patterns and statistics
- **Genre Analysis** with preference distribution
- **Viewing Streaks** and achievement tracking
- **Monthly Statistics** and trends over time
- **Completion Rates** and watch time analytics

### 🎭 Rich Movie Details
- **Comprehensive Information** including cast, crew, ratings
- **Multiple Rating Sources** (TMDB, IMDB, Rotten Tomatoes)
- **Video Integration** with YouTube trailers
- **Professional Reviews** and user feedback
- **Similar Movies** with intelligent recommendations
- **High-quality Images** with backdrop galleries

## 🛠️ Tech Stack

**Backend**
- **Node.js** for backend logic and API routing

**Frontend Framework**
- React 18.2.0 with TypeScript 5.0+
- Vite for lightning-fast development and builds

**Styling & UI**
- Tailwind CSS for utility-first styling
- Framer Motion for smooth animations
- Custom component library with variants
- Responsive design for all screen sizes

**State Management**
- Zustand with persistence middleware
- localStorage integration for data persistence
- Optimistic updates for better UX

**APIs & Services**
- TMDB API for comprehensive movie data
- OMDB API for additional ratings and details
- Custom caching service with TTL support
- Rate limiting with exponential backoff

**Performance & Optimization**
- Code splitting and lazy loading
- Infinite scroll pagination
- Debounced search input
- Intelligent API response caching
- Service Worker ready

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- API keys from TMDB and OMDB

### Installation

```bash
# Clone the repository
git clone https://github.com/benardopiyo/moviemind-ai.git
cd moviemind-ai

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
```

### Environment Configuration

Create a `.env` file with your API keys:

```env
# Required API Keys
VITE_TMDB_API_KEY=your_tmdb_api_key_here
VITE_OMDB_API_KEY=your_omdb_api_key_here

# Optional Configuration
VITE_APP_NAME=MovieMind AI
VITE_CACHE_TTL=300000
```

### Getting API Keys

1. **TMDB API Key**: 
   - Visit [themoviedb.org/settings/api](https://www.themoviedb.org/settings/api)
   - Create a free account and request an API key

2. **OMDB API Key**:
   - Visit [omdbapi.com/apikey.aspx](http://www.omdbapi.com/apikey.aspx)
   - Register for a free API key

### Development

```bash
# Start development server
npm run dev

# Run type checking
npm run type-check

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── common/          # Shared components (MovieCard, Rating, etc.)
│   ├── layout/          # Layout components (Header, Sidebar, Footer)
│   └── ui/              # Base UI components (Button, Card, Modal)
│
├── features/            # Feature-based modules
│   ├── discovery/       # Movie discovery and trending
│   ├── details/         # Movie details, cast, reviews, trailers
│   ├── search/          # Search functionality and filters
│   └── watchlist/       # Watchlist management and analytics
│
├── hooks/               # Custom React hooks (11 total)
│   ├── useApi.ts        # API integration hook
│   ├── useDebounce.ts   # Search debouncing
│   ├── useInfiniteScroll.ts # Pagination handling
│   └── ...              # Additional utility hooks
│
├── services/            # External service integration
│   ├── tmdb.ts         # TMDB API service
│   ├── omdb.ts         # OMDB API service
│   └── cache.ts        # Caching service with TTL
│
├── store/              # Global state management
│   ├── index.ts        # Store configuration
│   └── slices.ts       # State slices (movies, watchlist, user)
│
├── types/              # TypeScript type definitions
│   ├── movie.ts        # Movie and TV show types
│   ├── api.ts          # API response types
│   ├── user.ts         # User and preferences types
│   └── ...             # Additional type definitions
│
├── utils/              # Utility functions
│   ├── api.ts          # API helpers
│   ├── format.ts       # Data formatting
│   ├── helpers.ts      # General utilities
│   └── storage.ts      # localStorage helpers
│
└── pages/              # Page components
    ├── Home.tsx        # Dashboard and trending
    ├── Search.tsx      # Search and discovery
    ├── Details.tsx     # Movie details page
    ├── Watchlist.tsx   # Watchlist management
    └── ...            # Additional pages
```

## 🎯 Feature Highlights

### Smart Search & Discovery
- Instant search results with auto-suggestions
- Advanced filtering by multiple criteria
- Genre-based browsing with visual cards
- Trending content updated in real-time

### Professional Watchlist Management
- Four distinct categories for different viewing states
- Drag-and-drop organization between categories
- Personal rating system with 10-star precision
- Custom notes and priority levels for each movie
- Flexible tagging system for personal organization

### Comprehensive Analytics
- Visual charts powered by Recharts library
- Detailed viewing statistics and patterns
- Genre preference analysis
- Achievement system with streak tracking
- Export capabilities for data portability

### Rich Movie Experience
- High-resolution poster and backdrop images
- Complete cast and crew information
- Multiple rating sources for informed decisions
- Integrated trailer viewing with YouTube
- Professional and user review systems

## 🚀 Performance Features

- **Bundle Optimization**: Gzipped assets under 170KB
- **Lazy Loading**: Components loaded on demand
- **Intelligent Caching**: TTL-based API response caching
- **Infinite Scroll**: Efficient handling of large datasets
- **Debounced Search**: Optimized API calls for search

## 🎨 Design System

### Visual Design
- Modern, clean interface with professional aesthetics
- Dark/light theme support with smooth transitions
- Consistent color palette and typography
- Responsive grid system for all screen sizes

### User Experience
- Intuitive navigation with clear visual hierarchy
- Smooth animations and micro-interactions
- Loading states with skeleton screens
- Error handling with user-friendly messages
- Accessibility features with ARIA labels

## 🧪 Quality Assurance

### Code Quality
- 100% TypeScript coverage with strict mode
- Consistent coding patterns and naming conventions
- Modular architecture for maintainability
- Comprehensive error boundaries

### Performance
- Lighthouse performance scores optimization
- Bundle size monitoring and optimization
- Memory leak prevention with proper cleanup
- Efficient re-rendering with React optimization patterns

## 📊 Technical Metrics

- **Total Files**: 96 files across 32 directories
- **TypeScript Coverage**: 100%
- **Custom Hooks**: 11 specialized hooks
- **UI Components**: 20+ reusable components
- **Feature Modules**: 4 complete feature sets
- **Build Time**: ~10 seconds for production
- **Bundle Size**: 582KB main bundle (169KB gzipped)

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Build Output
- Optimized assets in `dist/` directory
- Code splitting for optimal loading
- Minified and gzipped for production
- Service Worker ready for PWA features


### Branches
- `main` - Production ready code
- `develop` - Development integration
- `feature/search-and-discovery` - Search and discovery features
- `feature/watchlist-management` - Watchlist and analytics features

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [The Movie Database (TMDB)](https://www.themoviedb.org/) for comprehensive movie data
- [Open Movie Database (OMDB)](http://www.omdbapi.com/) for additional ratings
- React and TypeScript communities for excellent tooling
- Tailwind CSS for utility-first styling approach

---

**Built by Opiyo Benard for movie enthusiasts**

*Experience intelligent movie discovery with professional-grade features*