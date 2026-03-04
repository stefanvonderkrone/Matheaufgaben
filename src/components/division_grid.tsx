interface DivisionGridProps {
  dividend: number;
  divisor: number;
}

export function DivisionGrid({ dividend, divisor }: DivisionGridProps) {
  const dividendStr = dividend.toString();
  const is4Digit = dividendStr.length === 4;
  
  // Grid dimensions
  const cols = is4Digit ? 14 : 10;
  const rows = is4Digit ? 11 : 8;
  
  // Position labels
  const positions = ['T', 'H', 'Z', 'E'];
  
  // Calculate positions for dividend and result labels
  const dividendStartCol = 1; // Column 2 (0-indexed: 1)
  const dividendLength = dividendStr.length;
  const resultStartCol = is4Digit ? 9 : 7; // Position for result field
  
  // Generate grid cells
  const generateCells = () => {
    const cells = [];
    
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        let content = '';
        let className = 'w-6 h-6 sm:w-8 sm:h-8 border border-gray-400 flex items-center justify-center text-base sm:text-lg font-semibold';
        
        // Row 0: Position labels (T, H, Z, E)
        if (row === 0) {
          // Labels above dividend
          if (col >= dividendStartCol && col < dividendStartCol + dividendLength) {
            const posIndex = 4 - dividendLength + (col - dividendStartCol);
            content = positions[posIndex] || '';
            className += ' text-xs text-gray-500';
          }
          // Labels above result (4 positions)
          else if (col >= resultStartCol && col < resultStartCol + 4) {
            const posIndex = col - resultStartCol;
            content = positions[posIndex] || '';
            className += ' text-xs text-gray-500';
          }
          else {
            className += ' bg-gray-50';
          }
        }
        // Row 1: The problem
        else if (row === 1) {
          if (col === 0) {
            // First cell is empty
            className += ' bg-gray-50';
          } else if (col >= dividendStartCol && col < dividendStartCol + dividendLength) {
            // Dividend digits
            const digitIndex = col - dividendStartCol;
            content = dividendStr[digitIndex];
          } else if (col === dividendStartCol + dividendLength) {
            // Division operator
            content = '÷';
            className += ' border-r border-gray-400';
          } else if (col === dividendStartCol + dividendLength + 1) {
            // Divisor
            content = divisor.toString();
          } else if (col === dividendStartCol + dividendLength + 2) {
            // Equals sign
            content = '=';
          } else if (col >= resultStartCol && col < resultStartCol + 4) {
            // Empty cells for result (student fills in)
            className += ' bg-white';
          } else {
            className += ' bg-gray-50';
          }
        }
        // Rows 2+: Empty for calculation
        else {
          if (col === 0) {
            className += ' bg-gray-50';
          } else if (col === dividendStartCol + dividendLength) {
            className += ' border-r border-gray-400';
          }
        }
        
        cells.push(
          <div key={`${row}-${col}`} className={className}>
            {content}
          </div>
        );
      }
    }
    
    return cells;
  };
  
  return (
    <div 
      className="print-break-inside-avoid inline-block border-2 border-gray-600"
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
        gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
      }}
    >
      {generateCells()}
    </div>
  );
}
