import type { DivisionProblem } from '../config/problem_types';

interface DivisionProblemProps {
  problem: DivisionProblem;
}

export function DivisionProblemComponent({ problem }: DivisionProblemProps) {
  const dividendStr = problem.dividend.toString().padStart(4, ' ');
  const quotientStr = problem.quotient.toString().padStart(4, ' ');
  
  // Create arrays for each position
  const positions = ['T', 'H', 'Z', 'E'];
  
  return (
    <div className="print-break-inside-avoid border border-gray-400 p-2 inline-block">
      {/* Grid for the problem */}
      <div className="grid grid-cols-5 gap-0">
        {/* Row 1: Position labels (T, H, Z, E) */}
        <div className="w-8 h-8"></div> {/* Empty first cell */}
        {positions.map((pos, idx) => (
          <div 
            key={`pos-${idx}`} 
            className="w-8 h-8 flex items-center justify-center text-xs text-gray-500 border border-gray-300"
          >
            {dividendStr[idx] !== ' ' ? pos : ''}
          </div>
        ))}
        
        {/* Row 2: The problem */}
        <div className="w-8 h-8"></div> {/* Empty first cell */}
        {dividendStr.split('').map((char, idx) => (
          <div 
            key={`div-${idx}`} 
            className={`w-8 h-8 flex items-center justify-center text-lg font-semibold border border-gray-300 ${char === ' ' ? 'bg-gray-100' : ''}`}
          >
            {char !== ' ' ? char : ''}
          </div>
        ))}
        
        {/* Row 3: Operator and divisor */}
        <div className="w-8 h-8 flex items-center justify-center text-lg font-semibold border border-gray-300 border-r-2 border-r-gray-600">
          ÷
        </div>
        <div className="w-8 h-8 flex items-center justify-center text-lg font-semibold border border-gray-300">
          {problem.divisor}
        </div>
        <div className="w-8 h-8 flex items-center justify-center text-lg font-semibold border border-gray-300">
          =
        </div>
        <div className="w-8 h-8 border border-gray-300"></div>
        <div className="w-8 h-8 border border-gray-300"></div>
        
        {/* Row 4: Empty row for result writing */}
        <div className="w-8 h-8 border border-gray-300 border-t-2 border-t-gray-600"></div>
        {quotientStr.split('').map((char, idx) => (
          <div 
            key={`quot-${idx}`} 
            className={`w-8 h-8 flex items-center justify-center text-lg font-semibold border border-gray-300 ${char === ' ' ? 'bg-gray-100' : ''}`}
          >
            {char !== ' ' ? char : ''}
          </div>
        ))}
      </div>
    </div>
  );
}
