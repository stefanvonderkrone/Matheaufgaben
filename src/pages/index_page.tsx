import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { gradeCategories } from '../config/grades';

function withRandomSeed(path: string): string {
  const seed = Math.floor(Math.random() * 1000000);
  return `${path}?seed=${seed}`;
}

export function IndexPage() {
  const categories = useMemo(
    () =>
      gradeCategories.map((category) => ({
        ...category,
        worksheets: category.worksheets.map((worksheet) => ({
          ...worksheet,
          url: withRandomSeed(worksheet.path),
        })),
      })),
    [],
  );

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Math Practice Worksheets</h1>

      <div className="max-w-md mx-auto space-y-10">
        {categories.map((category) => (
          <section key={category.id}>
            <h2 className="text-xl font-semibold mb-4">{category.title}</h2>

            {category.worksheets.length === 0 ? (
              <p className="text-sm text-gray-500 rounded-lg border border-dashed border-gray-300 p-4">
                Noch keine Aufgaben in dieser Kategorie.
              </p>
            ) : (
              <ul className="space-y-2">
                {category.worksheets.map((worksheet) => (
                  <li key={worksheet.id}>
                    <Link
                      to={worksheet.url}
                      className={`block p-4 rounded-lg transition-colors ${worksheet.colorClass}`}
                    >
                      <span className="font-semibold">{worksheet.title}</span>
                      <span className="text-sm text-gray-600 block">{worksheet.description}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}

        <p className="text-sm text-gray-500">
          Each worksheet gets a unique seed. Add ?seed=123 to the URL to get a specific worksheet.
        </p>
      </div>
    </div>
  );
}
