# Dark Theme Chrome Extension

A Chrome browser extension built with Preact and Vite that enables users to apply customizable dark themes to any website.

## Features

- Toggle dark theme on/off for any website
- Adjust theme intensity (0-100%)
- Site-specific preferences (whitelist/blacklist)
- Settings sync across Chrome instances
- Modern Preact-based popup interface

## Project Structure

```
dark-theme-extension/
├── src/
│   ├── popup/          # Preact components for popup UI
│   ├── content/        # Content scripts and styles
│   ├── background/     # Background service worker
│   └── assets/
│       └── icons/      # Extension icons
├── public/             # Static assets (manifest.json)
└── dist/               # Build output (generated)
```

## Development

### Prerequisites

- Node.js 18+ or Bun
- Chrome browser

### Setup

```bash
# Install dependencies
npm install
# or
bun install

# Start development server
npm run dev
# or
bun run dev

# Build extension
npm run build
# or
bun run build
```

### Loading the Extension

1. Run `npm run build` to generate the `dist/` folder
2. Open Chrome and navigate to `chrome://extensions`
3. Enable "Developer mode"
4. Click "Load unpacked"
5. Select the `dist/` folder

## Tech Stack

- **Preact** - Lightweight React alternative for UI
- **Vite** - Fast build tool and dev server
- **TypeScript** - Type safety
- **Chrome Extension Manifest V3** - Latest extension API

## Requirements

See `.kiro/specs/dark-theme-extension/requirements.md` for detailed requirements.

## Design

See `.kiro/specs/dark-theme-extension/design.md` for architecture and design decisions.

## License

MIT
