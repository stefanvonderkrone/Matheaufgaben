import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import type { DivisionProblem } from '../config/problem_types';
import { defaultConfig } from '../config/math_config';
import { getSeedFromUrl } from '../utils/random_generator';
import { generateDivisionProblems } from '../utils/division_generator';
import { DivisionWorksheet } from '../components/division_worksheet';

export function DivisionPage() {
  const [searchParams] = useSearchParams();
  const [problems, setProblems] = useState<DivisionProblem[]>([]);
  const [seed, setSeed] = useState<number>(0);
  const [currentUrl, setCurrentUrl] = useState<string>('');
  
  useEffect(() => {
    const seedValue = getSeedFromUrl();
    setSeed(seedValue);
    
    const generatedProblems = generateDivisionProblems(
      defaultConfig.problemsPerPage,
      seedValue
    );
    setProblems(generatedProblems);
    
    // Update URL with seed if not present
    if (!searchParams.has('seed')) {
      const newUrl = `${window.location.pathname}?seed=${seedValue}`;
      window.history.replaceState({}, '', newUrl);
    }
    
    setCurrentUrl(window.location.href);
  }, [searchParams]);
  
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
