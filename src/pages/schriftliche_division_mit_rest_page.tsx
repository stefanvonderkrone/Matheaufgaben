import { useMemo, useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { divisionWithRemainderConfig } from '../config/math_config';
import { generateDivisionWithRemainderProblems } from '../utils/division_mit_rest_generator';
import { DivisionMitRestWorksheet } from '../components/division_mit_rest_worksheet';

export function SchriftlicheDivisionMitRestPage() {
  const navigate = useNavigate();

  // Get seed from URL or generate new one
  const [searchParams] = useSearchParams();
  const seed = useMemo(() => {
    const seedParam = searchParams.get('seed');
    if (seedParam) {
      const seed = parseInt(seedParam, 10);
      if (!isNaN(seed)) {
        return seed;
      }
    }
    return 12345;
  }, [searchParams]);

  // State for manual seed input
  const [manualSeed, setManualSeed] = useState(seed.toString());

  // Generate problems based on seed
  const problems = useMemo(() => {
    return generateDivisionWithRemainderProblems(
      divisionWithRemainderConfig.problemsPerPage,
      seed
    );
  }, [seed]);

  const currentUrl =
    typeof window !== 'undefined' ? window.location.href : '';

  const handleNewSeed = () => {
    const newSeed = Math.floor(Math.random() * 1000000);
    navigate(`/schriftliche-division-mit-rest?seed=${newSeed}`);
  };

  const handleManualSeedSubmit = () => {
    const newSeed = parseInt(manualSeed, 10);
    if (!isNaN(newSeed)) {
      navigate(`/schriftliche-division-mit-rest?seed=${newSeed}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleManualSeedSubmit();
    }
  };

  return (
    <div className="min-h-screen">
      {/* Navigation - hidden when printing */}
      <nav className="no-print bg-gray-100 p-4 border-b">
        <div className="flex justify-between items-center max-w-6xl mx-auto">
          <Link
            to="/"
            className="text-blue-600 hover:text-blue-800 font-semibold"
          >
            ← Back to Overview
          </Link>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Seed: {seed}</span>

            {/* Manual seed input */}
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={manualSeed}
                onChange={(e) => setManualSeed(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter seed..."
                className="px-3 py-1 border border-gray-300 rounded text-sm w-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleManualSeedSubmit}
                className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700 transition-colors"
              >
                Go
              </button>
            </div>

            <button
              onClick={handleNewSeed}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              New Worksheet
            </button>
          </div>
        </div>

        <div className="max-w-6xl mx-auto mt-2">
          <p className="text-xs text-gray-500">
            Share this URL for the same worksheet: {currentUrl}
          </p>
        </div>
      </nav>

      {/* Print Header - visible only when printing */}
      <div className="print-only-header hidden print:block bg-white p-4 border-b-2 border-gray-300 mb-4">
        <div className="flex justify-between items-center max-w-6xl mx-auto">
          <h1 className="text-xl font-bold">Schriftliche Division mit Rest</h1>
          <div className="text-right">
            <p className="text-sm font-semibold">Seed: {seed}</p>
            <p className="text-xs text-gray-600 break-all">{currentUrl}</p>
          </div>
        </div>
      </div>

      {/* Worksheet content */}
      <main className="py-8">
        <h1 className="text-2xl font-bold text-center mb-8 no-print">
          Schriftliche Division mit Rest
        </h1>

        <DivisionMitRestWorksheet problems={problems} />
      </main>
    </div>
  );
}
