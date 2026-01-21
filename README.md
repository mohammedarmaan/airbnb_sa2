# Stay in SF  - San Francisco Airbnb Listings

A simple, elegant web application that displays Airbnb listings in San Francisco using vanilla JavaScript and AJAX.

**Live Demo:** [https://mohammedarmaan.github.io/airbnb_sa2/](https://mohammedarmaan.github.io/airbnb_sa2/)

## Preview

The application displays 50 Airbnb listings with search, filter, and sort functionality.

## Features

- **AJAX Data Loading** - Fetches listing data from JSON using `fetch()` and `async/await`
- **Search** - Real-time search by name, description, or neighborhood
- **Filter by Neighborhood** - Dropdown filter populated dynamically from data
- **Sort by Price** - Sort listings low-to-high or high-to-low
- **Dark Mode** - Toggle between light and dark themes (persists in localStorage)
- **Wishlist** - Save favorite listings (persists in localStorage) - yet to implement display of the wishlist
- **Responsive Design** - Works on desktop, tablet, and mobile

## Technologies Used

- HTML5
- CSS
- Vanilla JavaScript (ES6+)
- Bootstrap 5.3 
- Font Awesome 6 (icons)

## Project Structure

```
AIRBNB_SA2/
├── index.html                    # Main HTML page
├── airbnb_sf_listings_500.json   # Airbnb listings data
├── package.json                  # Project metadata and scripts
├── css/
│   └── main.css                  # Stylesheet
├── js/
│   └── main.js                   # JavaScript module
└── README.md                     # This file
```

## Getting Started

### Running the Project

1. Clone or download the project files

2. Start a local server using one of these methods:

   **Using Python:** (this is how I do)
   ```bash
   cd AIRBNB_SA2
   python -m http.server 8000
   ```

3. Open your browser and navigate to `http://localhost:8000` (or the port shown)

## Code Overview

### main.js

The JavaScript uses a **Module Pattern** for organization:

```javascript
function MainModule(listingsID = "#listings") {
  const me = {};
  
  // Private functions
  function parsePrice(priceStr) { ... }
  function getListingCode(listing) { ... }
  function redraw(listings) { ... }
  
  // Public methods
  me.redraw = redraw;
  me.loadData = loadData;
  
  return me;
}

const main = MainModule();
main.loadData();
```

### Key Functions

| Function | Description |
|----------|-------------|
| `loadData()` | Fetches JSON data using async/await |
| `redraw(listings)` | Renders listing cards to the DOM |
| `filterAndSort()` | Applies search, filter, and sort |
| `toggleFavorite()` | Adds/removes listings from wishlist |
| `toggleDarkMode()` | Switches between light/dark themes |

## 🎨 Creative Additions

1. **Dark Mode** - Full dark theme with smooth transitions
2. **Wishlist System** - Heart button to save favorites - yet to implement the ui to display the wishlist
3. **Live Search** - Debounced search for better performance
4. **Inline SVG Placeholders** - No external dependencies for broken images

## Notes

- Some listing images may not load because the Airbnb CDN URLs in the dataset (from 2023) have expired. These will display a "No Image" placeholder.

## Data Source

The listing data comes from the json file (airbnb_sf_listings_500.json) in the root directory.

## Author

Mohammed Armaan - Northeastern University, MS Computer Science
