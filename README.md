# Design Inspiration Figma Plugin

A Figma plugin that allows you to search for design inspiration and add images directly to your canvas with proper attribution.

## 🏗️ Architecture

This repository contains **only the Figma plugin frontend**. The plugin communicates with a separate backend service for web scraping functionality.

### Repository Structure

- **Plugin Repository** (this repo): Contains the Figma plugin UI and logic
- **Backend Repository**: [`figma-design-scraper-backend`](../figma-design-scraper-backend/) - Contains the Node.js API service

## 🚀 Setup Instructions

### 1. Start the Backend Service

First, make sure the backend service is running:

```bash
# Navigate to the backend directory
cd ../figma-design-scraper-backend

# Install dependencies (if not already done)
npm install

# Start the development server
npm run dev
```

The backend will run on `http://localhost:3001`

### 2. Build the Plugin

In this directory, build the plugin:

```bash
# Install dependencies
npm install

# Build the plugin
npm run build
```

Or for development with auto-rebuild:

```bash
npm run watch
```

### 3. Load the Plugin in Figma

1. Open Figma Desktop App
2. Go to **Plugins** → **Development** → **Import plugin from manifest**
3. Select the `manifest.json` file from this directory
4. The plugin will appear in your plugins list

## 🎯 How to Use

1. **Start the backend service** (step 1 above)
2. **Open the plugin** in Figma from the Plugins menu
3. **Search for designs** using terms like:
   - "modern dashboard"
   - "mobile app UI"
   - "fintech interface"
   - "e-commerce design"
4. **Select images** by clicking on them
5. **Paste to canvas** using the "Paste Selected Images" button

## 🔧 Development

### File Structure

```
├── code.ts           # Main plugin logic (runs in Figma sandbox)
├── ui.ts            # UI logic and interface
├── package.json     # Plugin configuration and dependencies
├── manifest.json    # Figma plugin manifest (auto-generated)
└── build/           # Built files (auto-generated)
    ├── main.js      # Compiled main logic
    └── ui.js        # Compiled UI
```

### Key Technologies

- **TypeScript**: For type safety and better development experience
- **@create-figma-plugin/utilities**: For Figma plugin development utilities
- **Figma Plugin API**: For interacting with Figma canvas

### Communication Flow

1. **UI** (ui.ts) sends search requests via `emit('SEARCH_DESIGNS', data)`
2. **Main** (code.ts) receives requests via `on('SEARCH_DESIGNS', handler)`
3. **Main** makes HTTP requests to backend API (`localhost:3001`)
4. **Main** sends results back to UI via `emit('SEARCH_RESULTS', data)`
5. **UI** displays results and handles user interactions

## 🌐 Backend API

The plugin expects the backend to provide:

**Endpoint**: `GET /api/scrape-design`

**Parameters**:

- `query` (required): Search term
- `page` (optional): Page number for pagination

**Response**:

```json
{
  "designs": [
    {
      "imageUrl": "https://example.com/image.jpg",
      "attribution": "Design by Artist Name",
      "sourceUrl": "https://source-website.com"
    }
  ],
  "pagination": {
    "page": 1,
    "totalPages": 5,
    "hasMore": true
  }
}
```

## 📝 Notes

- The backend must be running on `localhost:3001` for the plugin to work
- Images are fetched and embedded directly into Figma as image fills
- All images include proper attribution in the layer names
- Multiple selected images are positioned with slight offsets to avoid overlap

## 🛠️ Troubleshooting

### Plugin Won't Load

- Ensure `npm run build` completed successfully
- Check that `build/main.js` and `build/ui.js` exist
- Verify the `manifest.json` is present

### API Connection Issues

- Ensure the backend service is running on `localhost:3001`
- Check browser console for CORS or network errors
- Verify the backend API is responding at `/api/scrape-design`

### Build Errors

- Run `npm install` to ensure all dependencies are installed
- Check TypeScript errors with `npm run build`
- Ensure you're using Node.js 14+ and npm 7+

## 📝 Note

This plugin currently uses mock data for demonstration purposes. For production use, you would need to implement a backend service to fetch real images from design platforms while respecting their terms of service and API limits.

## 🛠️ Built With

- [Create Figma Plugin](https://yuanqing.github.io/create-figma-plugin/)
- TypeScript
- HTML/CSS/JavaScript

## 📄 License

This project is for educational and demonstration purposes.

## Development guide

_This plugin is built with [Create Figma Plugin](https://yuanqing.github.io/create-figma-plugin/)._

### Pre-requisites

- [Node.js](https://nodejs.org) – v22
- [Figma desktop app](https://figma.com/downloads/)

### Build the plugin

To build the plugin:

```
$ npm run build
```

This will generate a [`manifest.json`](https://figma.com/plugin-docs/manifest/) file and a `build/` directory containing the JavaScript bundle(s) for the plugin.

To watch for code changes and rebuild the plugin automatically:

```
$ npm run watch
```

### Install the plugin

1. In the Figma desktop app, open a Figma document.
2. Search for and run `Import plugin from manifest…` via the Quick Actions search bar.
3. Select the `manifest.json` file that was generated by the `build` script.

### Debugging

Use `console.log` statements to inspect values in your code.

To open the developer console, search for and run `Show/Hide Console` via the Quick Actions search bar.

## See also

- [Create Figma Plugin docs](https://yuanqing.github.io/create-figma-plugin/)
- [`yuanqing/figma-plugins`](https://github.com/yuanqing/figma-plugins#readme)

Official docs and code samples from Figma:

- [Plugin API docs](https://figma.com/plugin-docs/)
- [`figma/plugin-samples`](https://github.com/figma/plugin-samples#readme)
