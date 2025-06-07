// UI code for the Figma plugin
import { on, emit } from "@create-figma-plugin/utilities";

// Set up the HTML content
document.body.innerHTML = `
  <div class="header">
    <div class="title">Design Inspiration</div>
    <div class="subtitle">
      Search for design inspiration and add selected images to your canvas
      with proper attribution.
    </div>
  </div>

  <div class="search-section">
    <div class="search-container">
      <input
        type="text"
        id="searchInput"
        class="search-input"
        placeholder="Search for design inspiration (e.g., 'fintech app UI', 'dashboard')"
        tabindex="0"
        aria-label="Search for design inspiration"
      />
      <button
        id="searchBtn"
        class="btn btn-primary"
        tabindex="0"
        aria-label="Search for images"
      >
        Search
      </button>
    </div>
    <div id="errorMessage" class="error-message" style="display: none"></div>
  </div>

  <div class="results-section">
    <div class="results-header" id="resultsHeader" style="display: none">
      <span id="resultsCount" class="results-count">0 results found</span>
      <button
        id="selectAllBtn"
        class="btn btn-secondary select-all-btn"
        tabindex="0"
      >
        Select All
      </button>
    </div>

    <div class="results-container">
      <div id="resultsGrid" class="results-grid"></div>
      <div id="loadingState" class="loading" style="display: none">
        <div class="loading-spinner"></div>
        Searching for inspiration...
      </div>
      <div id="emptyState" class="empty-state">
        Enter a search term above to find design inspiration
      </div>
    </div>
  </div>

  <div class="paste-section">
    <button
      id="pasteBtn"
      class="btn btn-primary paste-btn"
      disabled
      tabindex="0"
      aria-label="Paste selected images to canvas"
    >
      Paste Selected Images to Canvas (0)
    </button>
  </div>
`;

// Add styles
const style = document.createElement("style");
style.textContent = `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    background: #ffffff;
    color: #333;
    padding: 16px;
    height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .header {
    margin-bottom: 20px;
  }

  .title {
    font-size: 18px;
    font-weight: 600;
    color: #333;
    margin-bottom: 8px;
  }

  .subtitle {
    font-size: 12px;
    color: #666;
    line-height: 1.4;
  }

  .search-section {
    margin-bottom: 20px;
  }

  .search-container {
    display: flex;
    gap: 8px;
    margin-bottom: 12px;
  }

  .search-input {
    flex: 1;
    padding: 8px 12px;
    border: 1px solid #e0e0e0;
    border-radius: 6px;
    font-size: 14px;
    outline: none;
    transition: border-color 0.2s;
  }

  .search-input:focus {
    border-color: #0066cc;
  }

  .search-input::placeholder {
    color: #999;
  }

  .btn {
    padding: 8px 16px;
    border: none;
    border-radius: 6px;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s;
    font-weight: 500;
  }

  .btn-primary {
    background: #0066cc;
    color: white;
  }

  .btn-primary:hover {
    background: #0052a3;
  }

  .btn-primary:disabled {
    background: #ccc;
    cursor: not-allowed;
  }

  .btn-secondary {
    background: #f5f5f5;
    color: #333;
    border: 1px solid #e0e0e0;
  }

  .btn-secondary:hover {
    background: #eeeeee;
  }

  .results-section {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 0;
  }

  .results-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
  }

  .results-count {
    font-size: 12px;
    color: #666;
  }

  .select-all-btn {
    font-size: 12px;
    padding: 4px 8px;
  }

  .results-container {
    flex: 1;
    overflow-y: auto;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 12px;
    background: #fafafa;
  }

  .results-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }

  .result-item {
    background: white;
    border-radius: 8px;
    padding: 8px;
    border: 2px solid transparent;
    cursor: pointer;
    transition: all 0.2s;
    position: relative;
  }

  .result-item:hover {
    border-color: #e0e0e0;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .result-item.selected {
    border-color: #0066cc;
    background: #f0f8ff;
  }

  .result-image {
    width: 100%;
    height: 80px;
    background: #f0f0f0;
    border-radius: 4px;
    margin-bottom: 8px;
    background-size: cover;
    background-position: center;
    position: relative;
  }

  .result-image::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    opacity: 0;
    transition: opacity 0.2s;
  }

  .result-item.selected .result-image::after {
    opacity: 1;
  }

  .result-title {
    font-size: 12px;
    font-weight: 500;
    color: #333;
    margin-bottom: 4px;
    line-height: 1.3;
  }

  .result-attribution {
    font-size: 10px;
    color: #666;
    line-height: 1.2;
  }

  .checkbox {
    position: absolute;
    top: 8px;
    right: 8px;
    width: 16px;
    height: 16px;
    background: white;
    border: 2px solid #ddd;
    border-radius: 3px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
  }

  .result-item.selected .checkbox {
    background: #0066cc;
    border-color: #0066cc;
  }

  .checkbox::after {
    content: "✓";
    font-size: 10px;
    color: white;
    opacity: 0;
    transition: opacity 0.2s;
  }

  .result-item.selected .checkbox::after {
    opacity: 1;
  }

  .paste-section {
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid #e0e0e0;
  }

  .paste-btn {
    width: 100%;
    padding: 12px;
    font-size: 14px;
    font-weight: 600;
  }

  .loading {
    text-align: center;
    padding: 40px 20px;
    color: #666;
    font-size: 14px;
  }

  .empty-state {
    text-align: center;
    padding: 40px 20px;
    color: #666;
    font-size: 14px;
  }

  .loading-spinner {
    width: 20px;
    height: 20px;
    border: 2px solid #e0e0e0;
    border-top: 2px solid #0066cc;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 12px;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .error-message {
    background: #ffe6e6;
    color: #cc0000;
    padding: 8px 12px;
    border-radius: 4px;
    font-size: 12px;
    margin-bottom: 12px;
  }
`;

document.head.appendChild(style);

// UI State Management
let searchResults: any[] = [];
let selectedImages: any[] = [];
let isLoading = false;

// DOM Elements
const searchInput = document.getElementById("searchInput") as HTMLInputElement;
const searchBtn = document.getElementById("searchBtn") as HTMLButtonElement;
const resultsGrid = document.getElementById("resultsGrid") as HTMLDivElement;
const resultsHeader = document.getElementById(
  "resultsHeader"
) as HTMLDivElement;
const resultsCount = document.getElementById("resultsCount") as HTMLSpanElement;
const selectAllBtn = document.getElementById(
  "selectAllBtn"
) as HTMLButtonElement;
const pasteBtn = document.getElementById("pasteBtn") as HTMLButtonElement;
const loadingState = document.getElementById("loadingState") as HTMLDivElement;
const emptyState = document.getElementById("emptyState") as HTMLDivElement;
const errorMessage = document.getElementById("errorMessage") as HTMLDivElement;

// Event Listeners
searchBtn.addEventListener("click", handleSearch);
selectAllBtn.addEventListener("click", handleSelectAll);
pasteBtn.addEventListener("click", handlePasteImages);

// Handle Enter key in search input
searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    handleSearch();
  }
});

// Handle search functionality
function handleSearch() {
  const query = searchInput.value.trim();

  if (!query) {
    showError("Please enter a search term");
    return;
  }

  if (isLoading) return;

  isLoading = true;
  setLoadingState(true);
  hideError();

  // Send search message to plugin code
  emit("SEARCH_DESIGNS", { query, page: 1 });
}

// Handle select all functionality
function handleSelectAll() {
  const allSelected = selectedImages.length === searchResults.length;

  if (allSelected) {
    selectedImages = [];
  } else {
    selectedImages = [...searchResults];
  }

  updateUI();
}

// Handle paste images functionality
function handlePasteImages() {
  if (selectedImages.length === 0) {
    showError("No images selected");
    return;
  }

  emit("PASTE_IMAGES", { selectedImages });
}

// Handle image selection
function handleImageSelect(imageData: any) {
  const index = selectedImages.findIndex((img) => img.id === imageData.id);

  if (index > -1) {
    selectedImages.splice(index, 1);
  } else {
    selectedImages.push(imageData);
  }

  updateUI();
}

// Update UI based on current state
function updateUI() {
  renderResults();

  const allSelected =
    selectedImages.length === searchResults.length && searchResults.length > 0;
  selectAllBtn.textContent = allSelected ? "Deselect All" : "Select All";

  pasteBtn.disabled = selectedImages.length === 0;
  pasteBtn.textContent = `Paste Selected Images to Canvas (${selectedImages.length})`;

  resultsCount.textContent = `${searchResults.length} result${
    searchResults.length !== 1 ? "s" : ""
  } found`;
}

// Render search results
function renderResults() {
  resultsGrid.innerHTML = "";

  searchResults.forEach((imageData) => {
    const isSelected = selectedImages.some((img) => img.id === imageData.id);

    const resultItem = document.createElement("div");
    resultItem.className = `result-item ${isSelected ? "selected" : ""}`;
    resultItem.tabIndex = 0;
    resultItem.setAttribute(
      "aria-label",
      `${imageData.title} - ${imageData.attribution}`
    );

    resultItem.innerHTML = `
      <div class="result-image" style="background-image: url('${imageData.url}')"></div>
      <div class="result-title">${imageData.title}</div>
      <div class="result-attribution">${imageData.attribution}</div>
      <div class="checkbox"></div>
    `;

    const handleSelect = () => handleImageSelect(imageData);
    resultItem.addEventListener("click", handleSelect);
    resultItem.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleSelect();
      }
    });

    resultsGrid.appendChild(resultItem);
  });
}

// Set loading state
function setLoadingState(loading: boolean) {
  isLoading = loading;
  searchBtn.disabled = loading;

  if (loading) {
    loadingState.style.display = "block";
    emptyState.style.display = "none";
    resultsHeader.style.display = "none";
  } else {
    loadingState.style.display = "none";
  }
}

// Show error message
function showError(message: string) {
  errorMessage.textContent = message;
  errorMessage.style.display = "block";
}

// Hide error message
function hideError() {
  errorMessage.style.display = "none";
}

// Listen for search results from main thread
on("SEARCH_RESULTS", (data: any) => {
  isLoading = false;
  setLoadingState(false);

  searchResults = data.results || [];
  selectedImages = [];

  if (searchResults.length > 0) {
    emptyState.style.display = "none";
    resultsHeader.style.display = "flex";
  } else {
    emptyState.style.display = "block";
    emptyState.textContent = "No results found. Try a different search term.";
    resultsHeader.style.display = "none";
  }

  updateUI();
});

// Listen for search errors from main thread
on("SEARCH_ERROR", (data: any) => {
  isLoading = false;
  setLoadingState(false);
  showError(data.error || "Failed to search for designs");
});

// Initialize UI
updateUI();
searchInput.focus();
