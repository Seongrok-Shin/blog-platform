# Blog Platform

A modern, full-stack blog platform built with Next.js 14, TypeScript, and Tailwind CSS. This platform provides a seamless blogging experience with a beautiful user interface and robust features.

## Features

- 📝 Modern blog editor with rich text formatting
- 🎨 Responsive design with Tailwind CSS
- 🔒 Authentication and user management
- 📱 Mobile-friendly interface
- 🚀 Server-side rendering for optimal performance
- 🔍 SEO optimized
- 💾 Database integration (coming soon)
- 📊 Analytics dashboard (coming soon)

## Tech Stack

- **Framework:** Next.js 14 with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Linting:** ESLint
- **Code Formatting:** Prettier
- **Testing:** Playwright (E2E)
- **Authentication:** (TBD)
- **Database:** (TBD)

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm, yarn, or pnpm

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/blog-platform.git
   cd blog-platform
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Run the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
blog-platform/
├── src/
│   ├── app/             # App router pages and layouts
│   ├── components/      # Reusable UI components
│   ├── lib/            # Utility functions and configurations
│   └── types/          # TypeScript type definitions
├── public/             # Static files
├── tailwind.config.js  # Tailwind CSS configuration
└── tsconfig.json      # TypeScript configuration
```

## Development

You can start editing the page by modifying `src/app/page.tsx`. The page auto-updates as you edit the file.

### Testing

The project uses Playwright for End-to-End testing. To run the tests:

```bash
# Run tests in headless mode
npm run test:e2e

# Run tests with UI
npm run test:e2e:ui

# Run tests in a specific browser
npm run test:e2e -- --project=chromium
```

Test files are located in the `tests` directory and follow the naming pattern `*.spec.ts`.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [TypeScript](https://www.typescriptlang.org)
