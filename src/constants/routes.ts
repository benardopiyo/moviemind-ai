// ===== src/constants/routes.ts =====
export const ROUTES = {
  HOME: '/',
  SEARCH: '/search',
  MOVIE: '/movie/:id',
  WATCHLIST: '/watchlist',
  TRENDING: '/trending',
  GENRES: '/genres/:id',
  DISCOVER: '/discover',
  PROFILE: '/profile',
  SETTINGS: '/settings',
} as const

export const NAVIGATION_ITEMS = [
  {
    name: 'Home',
    path: ROUTES.HOME,
    icon: 'Home',
  },
  {
    name: 'Search',
    path: ROUTES.SEARCH,
    icon: 'Search',
  },
  {
    name: 'Trending',
    path: ROUTES.TRENDING,
    icon: 'TrendingUp',
  },
  {
    name: 'Watchlist',
    path: ROUTES.WATCHLIST,
    icon: 'Bookmark',
  },
  {
    name: 'Discover',
    path: ROUTES.DISCOVER,
    icon: 'Compass',
  },
] as const