import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { defaultConfig } from '../config/math_config';
import { getSeedFromUrl } from '../utils/random_generator';
import { generateDivisionProblems } from '../utils/division_generator';
import { DivisionWorksheet } from '../components/division_worksheet';

export function DivisionPage() {
  // Get seed from URL or generate new one
  const seed = useMemo(() => {
    return getSeedFromUrl();
  }, []);
  
  // Generate problems based on seed
  const problems = useMemo(() => {
    return generateDivisionProblems(
      defaultConfig.problemsPerPage,
      seed
    );
  }, [seed]);
  
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  
  const handleNewSeed = () => {
    const newSeed = Math.floor(Math.random() * 1000000);
    const newUrl = `${window.location.pathname}?seed=${newSeed}`;
    window.location.href = newUrl;
  };
  
  return (
    <div className="min-h-screen">
      {/* Navigation - hidden when printing */}
      <nav className="no-print bg-gray-100 p-4 border-b">
        <div className="flex justify-between items-center max-w-6xl mx-auto">
          <Link to="/" className="text-blue-600 hover:text-blue-800 font-semibold">
            ← Back to Overview
          </Link>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Seed: {seed}</span>
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
      
      {/* Worksheet content */}
      <main className="py-8">
        <h1 className="text-2xl font-bold text-center mb-8 no-print">
          Schriftliche Division
        </h1>
        
        <DivisionWorksheet problems={problems} />
      </main>
    </div>
  );
}
