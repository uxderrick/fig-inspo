// Design Inspiration Figma Plugin - Main Logic
// This file handles the core plugin functionality

/// <reference types="@figma/plugin-typings" />

// Mock data for design inspiration images
// In a real implementation, this would come from a backend API that scrapes design websites
const MOCK_INSPIRATION_DATA = [
  {
    id: "1",
    url: "https://images.unsplash.com/photo-1512486130939-2c4f79935e4f?w=400&h=300&fit=crop",
    title: "Modern Fintech Dashboard",
    attribution: "Image by John Designer from Dribbble",
    tags: ["fintech", "dashboard", "ui", "modern"],
  },
  {
    id: "2",
    url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop",
    title: "Mobile Banking App",
    attribution: "Image by Sarah UI from Behance",
    tags: ["fintech", "mobile", "app", "banking"],
  },
  {
    id: "3",
    url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop",
    title: "Analytics Dashboard",
    attribution: "Image by Mike Charts from Figma Community",
    tags: ["analytics", "dashboard", "data", "charts"],
  },
  {
    id: "4",
    url: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=300&fit=crop",
    title: "E-commerce App Interface",
    attribution: "Image by Lisa Commerce from Pinterest",
    tags: ["ecommerce", "shopping", "mobile", "ui"],
  },
  {
    id: "5",
    url: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=300&fit=crop",
    title: "SaaS Landing Page",
    attribution: "Image by Alex SaaS from Awwwards",
    tags: ["saas", "landing", "web", "business"],
  },
  {
    id: "6",
    url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop",
    title: "Social Media App",
    attribution: "Image by Emma Social from Dribbble",
    tags: ["social", "media", "app", "community"],
  },
];

// Show the plugin UI
figma.showUI(__html__, {
  width: 400,
  height: 600,
  themeColors: true,
});

// Handle messages from the UI
figma.ui.onmessage = async (msg) => {
  console.log("Received message:", msg);

  if (msg.type === "search") {
    await handleSearch(msg.query);
  } else if (msg.type === "paste-images") {
    await handlePasteImages(msg.selectedImages);
  } else if (msg.type === "close") {
    figma.closePlugin();
  }
};

// Handle search functionality with mock data
async function handleSearch(query) {
  console.log("Searching for:", query);

  // Simulate search by filtering mock data based on query
  // In a real implementation, this would make an API call to a backend service
  const searchResults = MOCK_INSPIRATION_DATA.filter(
    (item) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.tags.some((tag) => tag.toLowerCase().includes(query.toLowerCase()))
  );

  // If no specific matches, return all mock data to show plugin functionality
  const results =
    searchResults.length > 0 ? searchResults : MOCK_INSPIRATION_DATA;

  // Send results back to UI
  figma.ui.postMessage({
    type: "search-results",
    results: results,
  });
}

// Handle pasting selected images to canvas
async function handlePasteImages(selectedImages) {
  console.log("Pasting images:", selectedImages);

  if (selectedImages.length === 0) {
    figma.notify("No images selected");
    return;
  }

  try {
    const startX = figma.viewport.center.x - 200;
    const startY = figma.viewport.center.y - 150;
    let currentX = startX;
    let currentY = startY;
    const spacing = 50;
    const imagesPerRow = 2;

    for (let i = 0; i < selectedImages.length; i++) {
      const imageData = selectedImages[i];

      // Create a frame to contain the image and attribution
      const frame = figma.createFrame();
      frame.name = `Inspiration: ${imageData.title}`;
      frame.x = currentX;
      frame.y = currentY;
      frame.resize(300, 250);
      frame.fills = [{ type: "SOLID", color: { r: 0.95, g: 0.95, b: 0.95 } }];

      try {
        // Load image from URL
        // Note: In a real plugin, you'd need to handle CORS and image loading properly
        // This is a simplified example - actual implementation would require a backend
        const imageBytes = await loadImageFromUrl(imageData.url);
        const imageHash = figma.createImage(imageBytes).hash;

        // Create rectangle for image
        const imageRect = figma.createRectangle();
        imageRect.name = "Inspiration Image";
        imageRect.resize(280, 180);
        imageRect.x = 10;
        imageRect.y = 10;
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
        placeholder.resize(280, 180);
        placeholder.x = 10;
        placeholder.y = 10;
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

      // Create attribution text
      const attributionText = figma.createText();
      await figma.loadFontAsync({ family: "Inter", style: "Regular" });
      attributionText.characters = imageData.attribution;
      attributionText.fontSize = 12;
      attributionText.x = 10;
      attributionText.y = 200;
      attributionText.resize(280, 30);
      attributionText.fills = [
        { type: "SOLID", color: { r: 0.4, g: 0.4, b: 0.4 } },
      ];

      frame.appendChild(attributionText);

      // Add frame to current page
      figma.currentPage.appendChild(frame);

      // Calculate position for next image
      if ((i + 1) % imagesPerRow === 0) {
        currentX = startX;
        currentY += 300 + spacing;
      } else {
        currentX += 300 + spacing;
      }
    }

    figma.notify(
      `Successfully added ${selectedImages.length} inspiration image(s) to canvas`
    );
  } catch (error) {
    console.error("Error pasting images:", error);
    figma.notify("Error adding images to canvas");
  }
}

// Helper function to load image from URL
// Note: This is a simplified example. In a real plugin, you'd need proper CORS handling
// and likely a backend service to fetch and serve images
async function loadImageFromUrl(url) {
  try {
    const response = await fetch(url);
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
