# Math Practice Worksheets

A Vite + React + TypeScript SPA for generating printable math worksheets.

## Features

- **Schriftliche Division** (Long Division): Generate worksheets with 3-4 digit dividends and 1-digit divisors
- **Seed-based generation**: Use URL parameters to create reproducible worksheets
- **Print-friendly**: Optimized CSS for printing on A4 paper
- **Responsive design**: Works on desktop and mobile devices

## Getting Started

### Development

```bash
npm install
npm run dev
```

Open http://localhost:5173/

### Build for Production

```bash
npm run build
```

The `dist/` folder will contain the static files ready for deployment.

## Usage

### Index Page
Navigate to `/` to see all available worksheet types.

### Division Worksheet
Navigate to `/division` to generate a random division worksheet.

### Reproducible Worksheets
Add a seed parameter to get the same worksheet every time:
```
/division?seed=12345
```

This is useful for:
- Sharing specific worksheets with students
- Creating answer keys
- Re-printing lost worksheets

## Configuration

Edit `src/config/math_config.ts` to adjust:
- Number of problems per page
- Number ranges for dividends and divisors

## Project Structure

```
src/
├── components/          # React components
│   ├── division_problem.tsx      # Single problem grid
│   └── division_worksheet.tsx    # Problems grid layout
├── config/              # Configuration files
│   ├── math_config.ts            # Global settings
│   └── problem_types.ts          # TypeScript interfaces
├── pages/               # Page components
│   ├── index_page.tsx            # Overview page
│   └── division_page.tsx         # Division worksheet page
├── utils/               # Utility functions
│   ├── division_generator.ts     # Problem generation logic
│   └── random_generator.ts       # Seeded random numbers
├── app.tsx              # Router setup
├── main.tsx             # Entry point
└── index.css            # Global styles + print CSS
```

## Technology Stack

- **Vite**: Build tool and dev server
- **React 19**: UI library
- **TypeScript**: Type safety
- **React Router**: Client-side navigation (SPA mode)
- **Tailwind CSS**: Utility-first styling

## Future Extensions

The architecture supports easy addition of new problem types:
- Addition
- Multiplication
- Subtraction

Simply implement the `MathProblem` interface and create a new generator.
