# ✈️ SkySearch - Flight Search Engine

A modern, responsive flight search engine built with React, Material UI, and Recharts. This application demonstrates professional-level frontend engineering with a focus on user experience principles.

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![MUI](https://img.shields.io/badge/MUI-v5-007FFF?logo=mui)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite)

## 🚀 Features

### Core Functionality
- **Smart Airport Search**: Debounced autocomplete with Amadeus API integration
- **Flexible Trip Options**: Round-trip and one-way flights
- **Date Validation**: Departure/return date pickers with logical constraints
- **Passenger Selection**: Support for adults, children, and infants
- **Travel Classes**: Economy, Premium Economy, Business, First Class

### Advanced Filtering
- **Stop Filter**: Nonstop, 1 stop, 2+ stops
- **Price Range Slider**: Dynamically adjusts to search results
- **Airline Filter**: Multi-select from available carriers
- **Real-time Updates**: Filters instantly update both list and graph

### Data Visualization
- **Live Price Graph**: Bar chart showing price distribution
- **Real-time Updates**: Graph updates as filters change
- **Price Insights**: Min, average, max price display

### UX Excellence
- **Dark/Light Mode**: System-aware with manual toggle
- **Responsive Design**: Mobile-first, works on all screen sizes
- **Loading States**: Skeleton loaders for better perceived performance
- **Error Handling**: Graceful error states with recovery actions

---

## 🎨 UX Principles Applied

### Shneiderman's 8 Golden Rules

| Rule | Implementation |
|------|----------------|
| **1. Consistency** | Unified design system with MUI, consistent spacing and colors |
| **2. Shortcuts** | Swap button for locations, popular airports preloaded |
| **3. Informative Feedback** | Loading skeletons, search result counts, price stats |
| **4. Dialogue Closure** | Clear "X flights found" message, confirmation states |
| **5. Error Prevention** | Date validation, disabled invalid options |
| **6. Easy Reversal** | "Clear all filters" button, reset functionality |
| **7. User Control** | All filters optional, customizable views |
| **8. Reduce Memory Load** | Airport autocomplete, recent searches, clear labels |

### Norman's 7 Principles

| Principle | Implementation |
|-----------|----------------|
| **Discoverability** | Clear CTAs, visible filters, intuitive icons |
| **Feedback** | Hover states, click animations, loading indicators |
| **Conceptual Model** | Familiar flight search patterns |
| **Affordances** | Buttons look clickable, sliders look draggable |
| **Signifiers** | Icons with labels, placeholder text, tooltips |
| **Mappings** | Price slider ↔ price range, left-right for dates |
| **Constraints** | Can't select past dates, return after departure |

### Nielsen's 10 Heuristics

| Heuristic | Implementation |
|-----------|----------------|
| **1. System Status** | Loading spinners, "Searching..." states |
| **2. Real World Match** | Flight icons, natural date formats |
| **3. User Control** | Clear filters, back navigation |
| **4. Consistency** | MUI design patterns throughout |
| **5. Error Prevention** | Validate before submit |
| **6. Recognition > Recall** | Dropdowns, autocomplete, recent searches |
| **7. Flexibility** | Quick filters, sort options |
| **8. Minimalist Design** | Clean UI, progressive disclosure |
| **9. Error Recovery** | Clear error messages, retry buttons |
| **10. Help** | Tooltips, placeholder hints |

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | React 18 with Vite |
| **UI Library** | Material UI (MUI) v5 |
| **State Management** | React Context + TanStack Query |
| **Charts** | Recharts |
| **HTTP Client** | Axios |
| **Date Handling** | Day.js |
| **Forms** | React Hook Form patterns |

---

## 📁 Project Structure

```
src/
├── api/                  # API layer
│   ├── client.js         # Axios instance with OAuth
│   ├── endpoints.js      # API endpoint constants
│   └── services/         # Service modules
│       ├── flightService.js
│       └── airportService.js
├── components/           # UI Components
│   ├── common/           # Shared components
│   ├── search/           # Search form components
│   ├── results/          # Flight result components
│   ├── filters/          # Filter components
│   └── charts/           # Data visualization
├── contexts/             # React Contexts
│   ├── ThemeContext.jsx  # Dark/light mode
│   └── SearchContext.jsx # Search state
├── hooks/                # Custom Hooks
│   ├── useDebounce.js
│   ├── useLocalStorage.js
│   └── useFlightSearch.js
├── layouts/              # Layout components
├── pages/                # Page components
├── styles/               # Theme and global CSS
└── utils/                # Utility functions
```

---

## 🚦 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd flight-search-engine

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Add your Amadeus API credentials to .env
```

### Amadeus API Setup

1. Create a free account at [Amadeus for Developers](https://developers.amadeus.com/)
2. Create a new application in the test environment
3. Copy your API Key and Secret to `.env`:

```env
VITE_AMADEUS_API_KEY=your_api_key
VITE_AMADEUS_API_SECRET=your_api_secret
```

### Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 📱 Responsive Design

The application is fully responsive with breakpoints:
- **Mobile**: < 600px (stacked layouts, collapsible filters)
- **Tablet**: 600px - 900px (adjusted spacing)
- **Desktop**: > 900px (sidebar filters, full features)

---

## ⚡ Performance Optimizations

- **Debounced Search**: 300ms delay on airport autocomplete
- **Memoized Computations**: Filtered flights, price stats
- **React Query Caching**: 5-minute stale time for API calls
- **Skeleton Loading**: Perceived performance improvement

---

## 🌙 Dark Mode

The application respects system preferences and includes a manual toggle:
- System preference detection on load
- Smooth transitions between themes
- Persistent preference in localStorage

---

## 📄 License

MIT License - feel free to use this project as a reference.

---

Built with ❤️ for the Spotter AI coding challenge

---

Author: Taimoor Raza Asif

---

Email: taimoorrazaasif581@gmail.com