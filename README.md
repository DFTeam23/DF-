# DF-

You inspire, We create

## Overview

A modern frontend web application built with React and JavaScript. Fully accessible and cross-platform compatible (Windows, macOS, Linux).

## Tech Stack

- **Framework:** React 18
- **Language:** JavaScript (ES6+)
- **Styling:** CSS / Tailwind CSS
- **Build Tool:** Vite
- **Package Manager:** npm
- **Accessibility:** WCAG 2.1 AA compliant

## Project Structure

```
DF-/
├── public/                 # Static assets
├── src/
│   ├── components/        # Reusable React components
│   ├── pages/            # Page components
│   ├── hooks/            # Custom React hooks
│   ├── utils/            # Utility functions
│   ├── styles/           # Global styles
│   ├── App.jsx           # Main App component
│   └── main.jsx          # Entry point
├── .gitignore
├── package.json
├── vite.config.js
├── .eslintrc.cjs
├── index.html
└── README.md
```

## Getting Started

### Prerequisites
- Node.js 16+ ([Download](https://nodejs.org/))
- npm (included with Node.js) or yarn

### Installation

#### macOS
```bash
# Using Homebrew (recommended)
brew install node

# Clone and setup
git clone https://github.com/DFTeam23/DF-.git
cd DF-
npm install
```

#### Windows
```bash
# Download and install Node.js from nodejs.org
# Then in Command Prompt or PowerShell:
git clone https://github.com/DFTeam23/DF-.git
cd DF-
npm install
```

#### Linux
```bash
sudo apt-get install nodejs npm
git clone https://github.com/DFTeam23/DF-.git
cd DF-
npm install
```

### Development

```bash
npm run dev
```

The application will automatically open at `http://localhost:5173`

### Build

```bash
npm run build
```

Output will be in the `dist/` directory

### Preview Production Build

```bash
npm run preview
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint to check code quality |

## Accessibility Features

- ✅ Semantic HTML structure
- ✅ ARIA labels and roles
- ✅ Keyboard navigation support
- ✅ Screen reader compatible
- ✅ High contrast support
- ✅ Focus indicators
- ✅ Alt text for images

## Cross-Platform Compatibility

This project is tested and compatible with:
- ✅ **macOS** (10.15+)
- ✅ **Windows** (10+)
- ✅ **Linux** (Ubuntu 18.04+)

## Troubleshooting

### macOS Specific Issues

**M1/M2 Mac Issues:**
If you encounter issues with native dependencies, try:
```bash
arch -arm64 npm install
```

**Port Already in Use:**
```bash
lsof -i :5173
kill -9 <PID>
```

### Node Version Issues

Use nvm (Node Version Manager) for better version management:
```bash
# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Install Node 20
nvm install 20
nvm use 20
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - See LICENSE file for details

## Support

For issues or questions, please create an [issue](https://github.com/DFTeam23/DF-/issues) on GitHub.
