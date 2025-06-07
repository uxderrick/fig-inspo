// Design Inspiration Figma Plugin - Main Logic
// This file handles the core plugin functionality

/// <reference types="@figma/plugin-typings" />

// Mock data for design inspiration images
// In a real implementation, this would come from a backend API that scrapes design websites
const MOCK_INSPIRATION_DATA = [
  {
    id: "1",
    url: "https://images.unsplash.com/photo-1512486130939-2c4f79935e4f",
    title: "Modern Fintech Dashboard",
    attribution: "Image by John Designer from Dribbble",
    tags: ["fintech", "dashboard", "ui", "modern"],
    source: "dribbble",
  },
  {
    id: "2",
    url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71",
    title: "Mobile Banking App",
    attribution: "Image by Sarah UI from Behance",
    tags: ["fintech", "mobile", "app", "banking"],
    source: "behance",
  },
  {
    id: "3",
    url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f",
    title: "Analytics Dashboard",
    attribution: "Image by Mike Charts from Figma Community",
    tags: ["analytics", "dashboard", "data", "charts"],
    source: "unsplash",
  },
  {
    id: "4",
    url: "https://images.unsplash.com/photo-1551650975-87deedd944c3",
    title: "E-commerce App Interface",
    attribution: "Image by Lisa Commerce from Pinterest",
    tags: ["ecommerce", "shopping", "mobile", "ui"],
    source: "pinterest",
  },
  {
    id: "5",
    url: "https://images.unsplash.com/photo-1557804506-669a67965ba0",
    title: "SaaS Landing Page",
    attribution: "Image by Alex SaaS from Awwwards",
    tags: ["saas", "landing", "web", "business"],
    source: "behance",
  },
  {
    id: "6",
    url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71",
    title: "Social Media App",
    attribution: "Image by Emma Social from Dribbble",
    tags: ["social", "media", "app", "community"],
    source: "dribbble",
  },
  {
    id: "7",
    url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71",
    title: "Fitness Tracking App",
    attribution: "Image by Tom Fitness from Pinterest",
    tags: ["fitness", "health", "tracking", "mobile"],
    source: "pinterest",
  },
];

// Show the plugin UI
// Note: __html__ should be replaced with actual HTML string or loaded differently
const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <title>Design Inspiration Plugin</title>
  <style>
    body { 
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; 
      padding: 20px 20px 100px 20px; 
      margin: 0; 
      background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
      color: #334155;
      line-height: 1.5;
      min-height: 100vh;
      box-sizing: border-box;
    }
    .search-container { 
      margin-bottom: 12px; 
      position: fixed;
      top: 20px;
      left: 20px;
      right: 20px;
      z-index: 100;
    }
    select {
    width: 100px;
      position: fixed;
      top: 80px;
      left: 20px;
      right: 20px;
      z-index: 100;
      padding: 8px 12px;
      padding-right: 18px;
      border: none;
      border-radius: 0;
      font-size: 11px;
      background: transparent;
      color: #64748b;
      font-family: inherit;
      font-weight: 500;
      transition: all 0.2s ease;
      outline: none;
      cursor: pointer;
      appearance: none;
      -webkit-appearance: none;
      -moz-appearance: none;
      background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2394a3b8' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
      background-position: right 4px center;
      background-repeat: no-repeat;
      background-size: 12px 12px;
    }
    select:focus {
      background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236366f1' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
    }
    select:hover {
      color: #475569;
      background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23475569' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
    }
    input { 
      width: 100%;
      padding: 12px 16px; 
      border: 2px solid transparent; 
      border-radius: 12px; 
      font-size: 14px;
      background: white;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
      transition: all 0.3s ease;
      outline: none;
      font-family: inherit;
    }
    input:focus {
      border-color: #6366f1;
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1), 0 4px 12px rgba(0, 0, 0, 0.08);
      transform: translateY(-1px);
    }
    input::placeholder {
      color: #94a3b8;
    }
    .results { 
      display: grid; 
      grid-template-columns: 1fr 1fr; 
      gap: 8px; 
      max-height: 400px;
      overflow-y: auto;
      padding-top: 100px;
      padding-bottom: 100px;
    }
    .results::-webkit-scrollbar {
      display: none;
    }
    .results {
      scrollbar-width: none; /* Firefox */
      -ms-overflow-style: none; /* Internet Explorer 10+ */
    }
    .result-item { 
      border: 1px solid rgba(226, 232, 240, 0.8); 
      border-radius: 16px; 
      padding: 12px; 
      cursor: pointer; 
      background: white;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
      position: relative;
      overflow: hidden;
    }
    .result-item::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(168, 85, 247, 0.05) 100%);
      opacity: 0;
      transition: opacity 0.3s ease;
      border-radius: inherit;
      z-index: 1;
    }
    .result-item:hover::before {
      opacity: 1;
    }
    .result-item:hover { 
      border-color: rgba(99, 102, 241, 0.2);
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08), 0 3px 10px rgba(0, 0, 0, 0.04);
    }
    .result-item.selected {
      background: linear-gradient(135deg, #f0f4ff 0%, #e0e7ff 100%);
      border-color: #6366f1;
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1), 0 8px 25px rgba(99, 102, 241, 0.15);
    }
    .result-item > * {
      position: relative;
      z-index: 2;
    }
    .result-item img { 
      width: 100%; 
      height: 85px; 
      object-fit: cover; 
      border-radius: 10px; 
      margin-bottom: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      transition: transform 0.3s ease;
    }
    .result-item:hover img {
      transform: scale(1.02);
    }
    .result-title {
      font-size: 12px;
      font-weight: 400;
      color: #1e293b;
      line-height: 1.3;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
      
    // }
    .result-attribution {
      font-size: 11px;
      color: #64748b;
      margin-bottom: 6px;
      line-height: 1.4;
    }
    .result-tags {
      font-size: 10px;
      color: #94a3b8;
      line-height: 1.3;
    }
    .action-buttons {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 16px 20px;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      border-top: 1px solid rgba(226, 232, 240, 0.8);
      display: flex;
      gap: 12px;
      z-index: 100;
      box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.08);
    }
    button {
      padding: 10px 16px;
      border: none;
      border-radius: 10px;
      cursor: pointer;
      font-size: 12px;
      font-weight: 600;
      font-family: inherit;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;
      flex: 1;
    }
    button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      transform: none !important;
    }
    .btn-primary {
      background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
      color: white;
      box-shadow: 0 2px 8px rgba(99, 102, 241, 0.3);
    }
    .btn-primary:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 4px 15px rgba(99, 102, 241, 0.4);
    }
    .btn-primary:active {
      transform: translateY(0);
    }
    .btn-secondary {
      background: white;
      color: #475569;
      border: 2px solid #e2e8f0;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
    }
    .btn-secondary:hover:not(:disabled) {
      background: #f8fafc;
      border-color: #cbd5e1;
      transform: translateY(-1px);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    }
    .loading {
      text-align: center;
      padding: 32px 20px;
      color: #64748b;
      font-size: 14px;
      background: rgba(255, 255, 255, 0.6);
      border-radius: 16px;
      margin: 20px 0;
      backdrop-filter: blur(10px);
    }
  </style>
</head>
<body>
  <div class="search-container">
    <input type="text" id="searchInput" placeholder="Search design inspiration (fintech, dashboard, mobile, etc.)" />
  </div>
  <select id="sourceFilter">
    <option value="all">All Sources</option>
    <option value="dribbble">Dribbble</option>
    <option value="behance">Behance</option>
    <option value="pinterest">Pinterest</option>
    <option value="unsplash">Unsplash</option>
  </select>
  <div id="results" class="results">
    <div class="loading">Loading inspiration...</div>
  </div>
  <div class="action-buttons">
    <button id="pasteButton" class="btn-primary" disabled>Add Selected to Canvas</button>
    <button id="refreshButton" class="btn-secondary">Clear selection</button>
  </div>

  <script>
    console.log('Design Inspiration Plugin UI loaded');
    
    let selectedImages = [];
    let currentResults = [];
    let currentSearchQuery = '';
    let currentSourceFilter = 'all';

    // Handle messages from main plugin
    window.onmessage = (event) => {
      const message = event.data.pluginMessage;
      if (message.type === 'search-results') {
        displayResults(message.results);
        currentResults = message.results;
      } else if (message.type === 'paste-complete') {
        clearSelection();
      }
    };

    // Send message to main plugin
    function sendMessage(message) {
      parent.postMessage({ pluginMessage: message }, '*');
    }

    // Display search results
    function displayResults(results) {
      const resultsContainer = document.getElementById('results');
      
      if (results.length === 0) {
        resultsContainer.innerHTML = '<div class="loading">No results found. Try a different search term.</div>';
        return;
      }

      resultsContainer.innerHTML = results.map(item => \`
        <div class="result-item" data-id="\${item.id}" onclick="toggleSelection('\${item.id}')">
          <img src="\${item.url}" alt="\${item.title}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjgwIiB2aWV3Qm94PSIwIDAgMTAwIDgwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik01MCA0MEwyNSA1NUg3NUw1MCA0MFoiIGZpbGw9IiNEREQiLz4KPC9zdmc+'" />
          <div class="result-title">\${item.title}</div>
        </div>
      \`).join('');
    }

    // Clear all selections
    function clearSelection() {
      selectedImages = [];
      document.querySelectorAll('.result-item.selected').forEach(element => {
        element.classList.remove('selected');
      });
      document.getElementById('pasteButton').disabled = true;
    }

    // Toggle image selection
    function toggleSelection(imageId) {
      const element = document.querySelector(\`[data-id="\${imageId}"]\`);
      const isSelected = selectedImages.includes(imageId);
      
      if (isSelected) {
        selectedImages = selectedImages.filter(id => id !== imageId);
        element.classList.remove('selected');
      } else {
        selectedImages.push(imageId);
        element.classList.add('selected');
      }
      
      document.getElementById('pasteButton').disabled = selectedImages.length === 0;
    }

    // Search functionality
    document.getElementById('searchInput').addEventListener('input', (e) => {
      currentSearchQuery = e.target.value.trim();
      sendMessage({ type: 'search', query: currentSearchQuery || '', source: currentSourceFilter });
    });

    // Source filter functionality
    document.getElementById('sourceFilter').addEventListener('change', (e) => {
      currentSourceFilter = e.target.value;
      sendMessage({ type: 'search', query: currentSearchQuery || '', source: currentSourceFilter });
    });

    // Paste selected images
    document.getElementById('pasteButton').addEventListener('click', () => {
      const selectedData = currentResults.filter(item => selectedImages.includes(item.id));
      sendMessage({ type: 'paste-images', selectedImages: selectedData });
    });

    // Refresh button
    document.getElementById('refreshButton').addEventListener('click', () => {
      clearSelection();
      document.getElementById('searchInput').value = '';
      document.getElementById('sourceFilter').value = 'all';
      currentSearchQuery = '';
      currentSourceFilter = 'all';
      sendMessage({ type: 'search', query: '', source: 'all' });
    });

    // Load initial results
    sendMessage({ type: 'search', query: '', source: 'all' });
  </script>
</body>
</html>
`;

figma.showUI(htmlContent, {
  width: 400,
  height: 600,
  themeColors: true,
});

// Handle messages from the UI
figma.ui.onmessage = async (msg) => {
  console.log("Received message:", msg);

  if (msg.type === "search") {
    await handleSearch(msg.query, msg.source);
  } else if (msg.type === "paste-images") {
    await handlePasteImages(msg.selectedImages);
  } else if (msg.type === "close") {
    figma.closePlugin();
  }
};

// Handle search functionality with mock data
async function handleSearch(query: string, source: string = "all") {
  console.log("Searching for:", query, "from source:", source);

  // Filter by source first
  let filteredData = MOCK_INSPIRATION_DATA;
  if (source !== "all") {
    filteredData = MOCK_INSPIRATION_DATA.filter(
      (item) => item.source === source
    );
  }

  // Then filter by search query
  const searchResults = filteredData.filter(
    (item) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.tags.some((tag) => tag.toLowerCase().includes(query.toLowerCase()))
  );

  // If no specific matches, return all filtered data to show plugin functionality
  const results = searchResults.length > 0 ? searchResults : filteredData;

  // Send results back to UI
  figma.ui.postMessage({
    type: "search-results",
    results: results,
  });
}

// Handle pasting selected images to canvas
async function handlePasteImages(selectedImages: any[]) {
  console.log("Pasting images:", selectedImages);

  if (selectedImages.length === 0) {
    figma.notify("No images selected");
    return;
  }

  try {
    const startX = figma.viewport.center.x - 400;
    const startY = figma.viewport.center.y - 300;
    let currentX = startX;
    let currentY = startY;
    const spacing = 80;
    const imagesPerRow = 2;

    for (let i = 0; i < selectedImages.length; i++) {
      const imageData = selectedImages[i];

      // Create a frame to contain the image and attribution
      const frame = figma.createFrame();
      frame.name = `Inspiration: ${imageData.title}`;
      frame.x = currentX;
      frame.y = currentY;
      frame.resize(600, 600);
      frame.fills = [{ type: "SOLID", color: { r: 0.95, g: 0.95, b: 0.95 } }];

      try {
        // Load image from URL
        // Note: In a real plugin, you'd need to handle CORS and image loading properly
        // This is a simplified example - actual implementation would require a backend
        const imageBytes = await loadImageFromUrl(imageData.url);

        let imageHash: string;
        try {
          imageHash = figma.createImage(imageBytes).hash;
        } catch (imageError: any) {
          if (
            imageError.message &&
            imageError.message.includes("Image is too large")
          ) {
            console.warn(
              `Image too large for ${imageData.title}, trying with smaller size`
            );
            try {
              // Try with an even smaller size constraint
              const smallerUrl = imageData.url.includes("?")
                ? `${imageData.url}&w=800&h=800&fit=inside`
                : `${imageData.url}?w=800&h=800&fit=inside`;
              const response = await fetch(smallerUrl);
              const arrayBuffer = await response.arrayBuffer();
              const smallerImageBytes = new Uint8Array(arrayBuffer);
              imageHash = figma.createImage(smallerImageBytes).hash;
            } catch (fallbackError) {
              console.error(
                "Even smaller image failed, falling back to placeholder"
              );
              throw new Error("Image too large, using placeholder");
            }
          } else {
            throw imageError;
          }
        }

        // Create rectangle for image
        const imageRect = figma.createRectangle();
        imageRect.name = "Inspiration Image";
        imageRect.resize(560, 520);
        imageRect.x = 20;
        imageRect.y = 20;
        imageRect.fills = [
          {
            type: "IMAGE",
            imageHash: imageHash,
            scaleMode: "FILL",
          },
        ];

        frame.appendChild(imageRect);
      } catch (error) {
        console.error("Error loading image:", error);

        // Create placeholder if image fails to load
        const placeholder = figma.createRectangle();
        placeholder.name = "Image Placeholder";
        placeholder.resize(560, 520);
        placeholder.x = 20;
        placeholder.y = 20;
        placeholder.fills = [
          {
            type: "SOLID",
            color: { r: 0.9, g: 0.9, b: 0.9 },
          },
        ];
        placeholder.strokes = [
          {
            type: "SOLID",
            color: { r: 0.7, g: 0.7, b: 0.7 },
          },
        ];
        placeholder.strokeWeight = 2;
        placeholder.dashPattern = [5, 5];

        frame.appendChild(placeholder);
      }

      // Create attribution text with URL
      const attributionText = figma.createText();
      await figma.loadFontAsync({ family: "Inter", style: "Regular" });
      attributionText.characters = `${imageData.attribution}\nURL: ${imageData.url}`;
      attributionText.fontSize = 14;
      attributionText.x = 20;
      attributionText.y = 550;
      attributionText.resize(560, 40);
      attributionText.fills = [
        { type: "SOLID", color: { r: 0.4, g: 0.4, b: 0.4 } },
      ];

      frame.appendChild(attributionText);

      // Add frame to current page
      figma.currentPage.appendChild(frame);

      // Calculate position for next image
      if ((i + 1) % imagesPerRow === 0) {
        currentX = startX;
        currentY += 600 + spacing;
      } else {
        currentX += 600 + spacing;
      }
    }

    figma.notify(
      `Successfully added ${selectedImages.length} inspiration image(s) to canvas`
    );

    // Send message to UI to clear selections
    figma.ui.postMessage({
      type: "paste-complete",
    });
  } catch (error) {
    console.error("Error pasting images:", error);
    figma.notify("Error adding images to canvas");
  }
}

// Helper function to load image from URL with size constraints
// Note: This is a simplified example. In a real plugin, you'd need proper CORS handling
// and likely a backend service to fetch and serve images
async function loadImageFromUrl(url: string): Promise<Uint8Array> {
  try {
    // Add size constraints to prevent "Image is too large" errors
    // Limit to reasonable dimensions for Figma
    const constrainedUrl = url.includes("?")
      ? `${url}&w=1200&h=1200&fit=inside`
      : `${url}?w=1200&h=1200&fit=inside`;

    const response = await fetch(constrainedUrl);
    const arrayBuffer = await response.arrayBuffer();
    return new Uint8Array(arrayBuffer);
  } catch (error) {
    console.error("Error loading image from URL:", error);
    throw error;
  }
}

// IMPORTANT NOTE FOR PRODUCTION:
// This plugin uses mock data and simplified image loading for demonstration.
// For a production version, you would need:
// 1. A backend service to handle web scraping of design inspiration sites
// 2. Proper CORS handling for image loading
// 3. Image optimization and caching
// 4. Rate limiting and error handling
// 5. Legal compliance for image usage and attribution

// Export default function required for Figma plugin
export default function () {
  // Plugin initialization is handled by the code above
  console.log("Design Inspiration Plugin initialized");
}
