# Inco Privacy Level Playground

A React web application that visualizes Inco's Four Levels of Confidentiality, allowing users to compare standard blockchain transparency with Inco's confidential encryption.

## Features

- 🎨 **Interactive Privacy Visualization** - Compare four different privacy levels
- 🔒 **EVM Address Validation** - Validates Ethereum wallet addresses
- 🎭 **Smooth Animations** - Powered by Framer Motion
- 🎨 **Modern UI** - Built with Tailwind CSS and Inco brand colors
- 📱 **Responsive Design** - Works on all device sizes

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Framer Motion** - Animation library
- **Tailwind CSS** - Utility-first CSS framework

## Getting Started

### Prerequisites

- Node.js 16+ and npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The app will open at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

The production build will be in the `dist` folder.

### Preview Production Build

```bash
npm run preview
```

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repository in Vercel
3. Vercel will automatically detect Vite and configure the build settings
4. Deploy!

The project includes a `vercel.json` configuration file for optimal deployment.

## Project Structure

```
├── src/
│   ├── App.jsx          # Main application component
│   ├── main.jsx         # React entry point
│   ├── index.css        # Global styles and Tailwind directives
│   └── asset/
│       └── images/      # Image assets (logo, nerd character)
├── index.html           # HTML template
├── vite.config.js       # Vite configuration
├── tailwind.config.js   # Tailwind CSS configuration
├── postcss.config.js    # PostCSS configuration
└── vercel.json          # Vercel deployment configuration
```

## Color Palette

The application uses Inco's brand color palette:
- `#1B3E86` - Dark Blue (Primary Background)
- `#3673F5` - Blue (Primary Accent)
- `#8EB1F9` - Light Blue (Secondary)
- `#E7EEFE` - Lightest Blue (Background)

## Author

Made by [sapiensp](https://t.me/sapiensp)

## License

MIT

