/// <reference types="@figma/plugin-typings" />

import { on, once, emit, showUI } from "@create-figma-plugin/utilities";

// Plugin main code that runs in the Figma environment
console.log("Design Inspiration Plugin loaded");

// Show the UI when plugin is run
showUI({
  width: 400,
  height: 600,
  title: "Design Inspiration",
});

// Handle search requests from UI
on("SEARCH_DESIGNS", async (data: { query: string; page: number }) => {
  try {
    console.log("Searching for designs:", data.query);

    // Make API call to the backend service
    const response = await fetch(
      `http://localhost:3001/api/scrape-design?query=${encodeURIComponent(
        data.query
      )}&page=${data.page || 1}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const apiData = await response.json();

    // Send results back to UI
    emit("SEARCH_RESULTS", {
      results: apiData.designs || [],
    });
  } catch (error) {
    console.error("Error fetching designs:", error);

    // Send error back to UI
    emit("SEARCH_ERROR", {
      error: error instanceof Error ? error.message : "Failed to fetch designs",
    });
  }
});

// Handle paste images request from UI
on("PASTE_IMAGES", async (data: { selectedImages: any[] }) => {
  try {
    console.log("Pasting images:", data.selectedImages.length);

    for (const image of data.selectedImages) {
      // Create an image node in Figma
      const imageNode = figma.createRectangle();
      imageNode.name = `Design: ${image.attribution}`;

      // Fetch the image and create image fill
      const response = await fetch(image.url);
      const imageBuffer = await response.arrayBuffer();
      const uint8Array = new Uint8Array(imageBuffer);

      const figmaImage = figma.createImage(uint8Array);

      // Set the image as fill
      imageNode.fills = [
        {
          type: "IMAGE",
          imageHash: figmaImage.hash,
          scaleMode: "FILL",
        },
      ];

      // Set size
      imageNode.resize(300, 200);

      // Position at viewport center (with offset for multiple images)
      const viewport = figma.viewport.center;
      const offset = data.selectedImages.indexOf(image) * 20;
      imageNode.x = viewport.x - 150 + offset;
      imageNode.y = viewport.y - 100 + offset;

      // Add to current page
      figma.currentPage.appendChild(imageNode);
    }

    // Select all created nodes
    const newNodes = figma.currentPage.children.slice(
      -data.selectedImages.length
    );
    figma.currentPage.selection = newNodes as SceneNode[];

    // Notify UI of success
    console.log("Successfully created image nodes");
  } catch (error) {
    console.error("Error creating image nodes:", error);

    emit("SEARCH_ERROR", {
      error: error instanceof Error ? error.message : "Failed to create images",
    });
  }
});

// Handle plugin close
once("CLOSE_PLUGIN", () => {
  figma.closePlugin();
});
