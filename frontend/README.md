# Finance Agent Frontend

A modern, responsive finance management application built with React, TypeScript, and Tailwind CSS.

## Features

- 💰 Track income and expenses
- 📊 View financial insights and analytics
- 🔐 Secure authentication
- 🌓 Light/Dark mode
- 📱 Responsive design
- 🚀 Optimized performance with code splitting

## Prerequisites

- Node.js 16+ and npm/yarn
- Backend API server (see backend repository for setup)

## Getting Started

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd finance-agent/frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

3. Install TypeScript type definitions:
   ```bash
   npm install --save-dev @types/react @types/react-dom @types/react-router-dom @types/uuid
   # or
   yarn add --dev @types/react @types/react-dom @types/react-router-dom @types/uuid
   ```

4. Create a `.env` file in the root directory and add your environment variables:
   ```env
   VITE_API_URL=http://localhost:8000
   ```

5. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Available Scripts

- `dev` - Start development server
- `build` - Build for production
- `preview` - Preview production build locally
- `lint` - Run ESLint
- `type-check` - Run TypeScript type checking
- `format` - Format code with Prettier

## Troubleshooting

### TypeScript Errors

If you encounter TypeScript errors related to missing type definitions, make sure you've installed all the required `@types` packages:

```bash
npm install --save-dev @types/react @types/react-dom @types/react-router-dom @types/uuid
```

### Lint Errors

To automatically fix linting issues, run:

```bash
npm run lint -- --fix
# or
yarn lint --fix
```

## Project Structure

```
src/
├── assets/          # Static assets
├── components/      # Reusable components
│   ├── ui/          # Base UI components
│   └── layout/      # Layout components
├── contexts/        # React context providers
├── hooks/           # Custom React hooks
├── lib/             # Utility functions
├── styles/          # Global styles
└── types/           # TypeScript type definitions
```

## Tech Stack

- ⚛️ React 18
- 🎨 Tailwind CSS
- 🔷 TypeScript
- 🛣️ React Router
- ⚡ Vite
- 📦 React Query (for data fetching)
- 🎨 Headless UI (for accessible components)
- 📱 Framer Motion (for animations)

## Contributing

1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
