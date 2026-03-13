import { useMemo } from 'react';
import { Link } from 'react-router-dom';

export function IndexPage() {
  // Generate random seeds for worksheet links
  const divisionUrl = useMemo(() => {
    const seed = Math.floor(Math.random() * 1000000);
    return `/division?seed=${seed}`;
  }, []);

  const divisionMitRestUrl = useMemo(() => {
    const seed = Math.floor(Math.random() * 1000000);
    return `/schriftliche-division-mit-rest?seed=${seed}`;
  }, []);

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Math Practice Worksheets</h1>

      <div className="max-w-md mx-auto">
        <h2 className="text-xl font-semibold mb-4">Available Worksheets:</h2>

        <ul className="space-y-2">
          <li>
            <Link
              to={divisionUrl}
              className="block p-4 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors"
            >
              <span className="font-semibold">Schriftliche Division</span>
              <span className="text-sm text-gray-600 block">Long Division Practice</span>
            </Link>
          </li>
          <li>
            <Link
              to={divisionMitRestUrl}
              className="block p-4 bg-green-100 hover:bg-green-200 rounded-lg transition-colors"
            >
              <span className="font-semibold">Schriftliche Division mit Rest</span>
              <span className="text-sm text-gray-600 block">Long Division with Remainder</span>
            </Link>
          </li>
        </ul>

        <p className="mt-8 text-sm text-gray-500">
          Each worksheet gets a unique seed. Add ?seed=123 to the URL to get a specific worksheet.
        </p>
      </div>
    </div>
  );
}
