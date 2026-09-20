import { useMemo, useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { generateCalculationRulesProblems } from '../utils/calculation_rules_generator';
import { CalculationRulesWorksheet } from '../components/calculation_rules_worksheet';

export function CalculationRulesPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const seed = useMemo(() => {
    const seedParam = searchParams.get('seed');
    if (seedParam) {
      const parsed = parseInt(seedParam, 10);
      if (!isNaN(parsed)) {
        return parsed;
      }
    }
    return 12345;
  }, [searchParams]);

  const [manualSeed, setManualSeed] = useState(seed.toString());

  const problems = useMemo(() => {
    return generateCalculationRulesProblems(seed);
  }, [seed]);

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  const handleNewSeed = () => {
    const newSeed = Math.floor(Math.random() * 1000000);
    navigate(`/rechenregeln-1?seed=${newSeed}`);
  };

  const handleManualSeedSubmit = () => {
    const newSeed = parseInt(manualSeed, 10);
    if (!isNaN(newSeed)) {
      navigate(`/rechenregeln-1?seed=${newSeed}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleManualSeedSubmit();
    }
  };

  return (
    <div className="min-h-screen">
      <nav className="no-print bg-gray-100 p-4 border-b">
        <div className="flex justify-between items-center max-w-6xl mx-auto">
          <Link to="/" className="text-blue-600 hover:text-blue-800 font-semibold">
            ← Zurück zur Übersicht
          </Link>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Seed: {seed}</span>

            <div className="flex items-center gap-2">
              <input
                type="number"
                value={manualSeed}
                onChange={(e) => setManualSeed(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Seed eingeben..."
                className="px-3 py-1 border border-gray-300 rounded text-sm w-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleManualSeedSubmit}
                className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700 transition-colors"
              >
                Los
              </button>
            </div>

            <button
              onClick={handleNewSeed}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Neues Arbeitsblatt
            </button>
          </div>
        </div>

        <div className="max-w-6xl mx-auto mt-2">
          <p className="text-xs text-gray-500">
            Teile diese URL für das gleiche Arbeitsblatt: {currentUrl}
          </p>
        </div>
      </nav>

      <div className="print-only-header hidden print:block bg-white p-4 border-b-2 border-gray-300 mb-4">
        <div className="flex justify-between items-center max-w-6xl mx-auto">
          <h1 className="text-xl font-bold">Rechenregeln 1</h1>
          <div className="text-right">
            <p className="text-sm font-semibold">Seed: {seed}</p>
            <p className="text-xs text-gray-600 break-all">{currentUrl}</p>
          </div>
        </div>
      </div>

      <main className="py-8">
        <h1 className="text-2xl font-bold text-center mb-8 no-print">Rechenregeln 1</h1>
        <CalculationRulesWorksheet problems={problems} />
      </main>
    </div>
  );
}
