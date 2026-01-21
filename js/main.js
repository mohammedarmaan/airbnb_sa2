// placeholder
const PLACEHOLDER_IMG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200' viewBox='0 0 300 200'%3E%3Crect fill='%23ddd' width='300' height='200'/%3E%3Ctext fill='%23999' font-family='Arial' font-size='14' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3ENo Image%3C/text%3E%3C/svg%3E";

const PLACEHOLDER_HOST = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 28 28'%3E%3Crect fill='%23ddd' width='28' height='28' rx='14'/%3E%3Ctext fill='%23999' font-family='Arial' font-size='12' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3EH%3C/text%3E%3C/svg%3E";

function MainModule(listingsID = "#listings") {
  const me = {};

  const listingsElement = document.querySelector(listingsID);
  const searchInput = document.querySelector("#searchInput");
  const neighborhoodFilter = document.querySelector("#neighborhoodFilter");
  const priceSort = document.querySelector("#priceSort");
  const listingsCount = document.querySelector("#listingsCount");

  let allListings = [];

  // Parse price string to number
  function parsePrice(priceStr) {
    if (!priceStr) return 0;
    return parseFloat(priceStr.replace(/[$,]/g, ""));
  }

  // Format amenities n show only first 3
  function formatAmenities(amenitiesStr) {
    if (!amenitiesStr) return "";
    try {
      const amenities = JSON.parse(amenitiesStr.replace(/'/g, '"'));
      return amenities
        .slice(0, 3)
        .map((a) => `<span class="amenity-tag">${a}</span>`)
        .join("");
    } catch (e) {
      return "";
    }
  }

  // listing card
  function getListingCode(listing) {
    const price = parsePrice(listing.price);
    const isFavorited = favorites.has(listing.id);

    return `
    <div class="listing-card">
      <div class="card-image">
        <img
          src="${listing.picture_url || PLACEHOLDER_IMG}"
          alt="${listing.name || "Listing"}"
          loading="lazy"
          onerror="this.onerror=null; this.src='${PLACEHOLDER_IMG}';"
        />
        <button class="wishlist-btn ${isFavorited ? "active" : ""}" onclick="toggleFavorite(this, ${listing.id})">
          <i class="${isFavorited ? "fas" : "far"} fa-heart"></i>
        </button>
      </div>
      
      <div class="card-content">
        <div class="card-header">
          <span class="card-location">${listing.neighbourhood_cleansed || "San Francisco"}</span>
          <span class="card-rating">
            <i class="fas fa-star"></i>
            ${listing.review_scores_rating ? listing.review_scores_rating.toFixed(1) : "New"}
          </span>
        </div>
        
        <h3 class="card-title">${listing.name || "Untitled Listing"}</h3>
        
        <p class="card-details">
          ${listing.bedrooms || 0} bed · ${listing.bathrooms_text || "1 bath"} · ${listing.accommodates || 1} guests
        </p>
        
        <div class="card-amenities">
          ${formatAmenities(listing.amenities)}
        </div>
        
        <div class="card-footer">
          <div class="host-info">
            <img 
              src="${listing.host_picture_url || PLACEHOLDER_HOST}" 
              alt="${listing.host_name || "Host"}"
              class="host-photo"
              onerror="this.onerror=null; this.src='${PLACEHOLDER_HOST}';"
            />
            <span class="host-name">${listing.host_name || "Host"}</span>
          </div>
          <div class="card-price">$${price}<span>/night</span></div>
        </div>
      </div>
    </div>
    `;
  }

  function redraw(listings) {
    if (!listingsElement) return;

    if (listings.length === 0) {
      listingsElement.innerHTML = `
        <div class="error-state" style="grid-column: 1/-1;">
          <p>No listings found. Try a different search.</p>
        </div>
      `;
      if (listingsCount) listingsCount.textContent = "0";
      return;
    }

    listingsElement.innerHTML = listings.map(getListingCode).join("");
    if (listingsCount) listingsCount.textContent = listings.length;
  }

  // Populate neighborhood filter
  function populateNeighborhoodFilter(listings) {
    if (!neighborhoodFilter) return;

    const neighborhoods = [
      ...new Set(listings.map((l) => l.neighbourhood_cleansed).filter(Boolean)),
    ].sort();

    neighborhoods.forEach((n) => {
      const option = document.createElement("option");
      option.value = n;
      option.textContent = n;
      neighborhoodFilter.appendChild(option);
    });
  }

  // Filter and sort listings
  function filterAndSort() {
    let filtered = [...allListings];

    // Search filter
    if (searchInput && searchInput.value) {
      const term = searchInput.value.toLowerCase();
      filtered = filtered.filter(
        (l) =>
          (l.name && l.name.toLowerCase().includes(term)) ||
          (l.description && l.description.toLowerCase().includes(term)) ||
          (l.neighbourhood_cleansed &&
            l.neighbourhood_cleansed.toLowerCase().includes(term))
      );
    }

    // Neighborhood filter
    if (neighborhoodFilter && neighborhoodFilter.value) {
      filtered = filtered.filter(
        (l) => l.neighbourhood_cleansed === neighborhoodFilter.value
      );
    }

    // Price sort
    if (priceSort && priceSort.value) {
      filtered.sort((a, b) => {
        const priceA = parsePrice(a.price);
        const priceB = parsePrice(b.price);
        return priceSort.value === "asc" ? priceA - priceB : priceB - priceA;
      });
    }

    me.redraw(filtered);
  }

  // Debounce helper
  function debounce(func, wait) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  }

  async function loadData() {
    if (listingsElement) {
      listingsElement.innerHTML = `
        <div class="loading-state" style="grid-column: 1/-1;">
          <div class="spinner-border" role="status"></div>
          <p>Loading listings...</p>
        </div>
      `;
    }

    try {
      const res = await fetch("./airbnb_sf_listings_500.json");

      if (!res.ok) throw new Error("Failed to load");

      const listings = await res.json();
      allListings = listings.slice(0, 50);

      populateNeighborhoodFilter(allListings);
      me.redraw(allListings);

      // Add event listeners
      if (searchInput) {
        searchInput.addEventListener("input", debounce(filterAndSort, 300));
      }
      if (neighborhoodFilter) {
        neighborhoodFilter.addEventListener("change", filterAndSort);
      }
      if (priceSort) {
        priceSort.addEventListener("change", filterAndSort);
      }
    } catch (error) {
      console.error("Error:", error);
      if (listingsElement) {
        listingsElement.innerHTML = `
          <div class="error-state" style="grid-column: 1/-1;">
            <p>Unable to load listings. Please try again.</p>
            <button class="btn btn-primary mt-3" onclick="main.loadData()">Retry</button>
          </div>
        `;
      }
    }
  }

  me.redraw = redraw;
  me.loadData = loadData;

  return me;
}

// Favorites functionality
const favorites = new Set(
  JSON.parse(localStorage.getItem("airbnbFavorites") || "[]")
);

function toggleFavorite(btn, listingId) {
  const icon = btn.querySelector("i");

  if (favorites.has(listingId)) {
    favorites.delete(listingId);
    icon.classList.replace("fas", "far");
    btn.classList.remove("active");
  } else {
    favorites.add(listingId);
    icon.classList.replace("far", "fas");
    btn.classList.add("active");
  }

  localStorage.setItem("airbnbFavorites", JSON.stringify([...favorites]));
  updateFavoriteCount();
}

function updateFavoriteCount() {
  const countEl = document.querySelector("#favoriteCount");
  if (countEl) {
    countEl.textContent = favorites.size;
  }
}

// Dark mode toggle
function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
  const isDark = document.body.classList.contains("dark-mode");
  localStorage.setItem("darkMode", isDark);

  const icon = document.querySelector("#darkModeToggle i");
  if (icon) {
    icon.classList.toggle("fa-moon", !isDark);
    icon.classList.toggle("fa-sun", isDark);
  }
}

// Initialize on page load
document.addEventListener("DOMContentLoaded", () => {
  // Load dark mode preference
  if (localStorage.getItem("darkMode") === "true") {
    document.body.classList.add("dark-mode");
    const icon = document.querySelector("#darkModeToggle i");
    if (icon) {
      icon.classList.replace("fa-moon", "fa-sun");
    }
  }
  updateFavoriteCount();
});

// Start the app
const main = MainModule();
main.loadData();