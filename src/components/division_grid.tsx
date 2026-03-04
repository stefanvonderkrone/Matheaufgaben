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
  const resultStartCol = is4Digit ? 8 : 7; // Position for result field
  
  // Generate grid cells
  const generateCells = () => {
    const cells = [];
    
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        let content = '';
        let className = 'w-8 h-8 sm:w-10 sm:h-10 print:w-[10mm] print:h-[10mm] border border-gray-300 flex items-center justify-center text-lg sm:text-xl print:text-[10pt] font-semibold';
        
        // Row 0: Position labels (T, H, Z, E)
        if (row === 0) {
          // Labels above dividend
          if (col >= dividendStartCol && col < dividendStartCol + dividendLength) {
            const posIndex = 4 - dividendLength + (col - dividendStartCol);
            content = positions[posIndex] || '';
            className += ' text-xs text-gray-500 print:text-[8pt]';
          }
          // Labels above result (4 positions)
          else if (col >= resultStartCol && col < resultStartCol + 4) {
            const posIndex = col - resultStartCol;
            content = positions[posIndex] || '';
            className += ' text-xs text-gray-500 print:text-[8pt]';
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
            className += ' border-r border-gray-300';
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
        // Row 2: Minus sign and calculation helper
        else if (row === 2) {
          if (col === 0) {
            // First cell: minus sign with black bottom border
            content = '-';
            className += ' border-b-2 border-b-black';
          } else if (col === 1) {
            // Second cell: black bottom border
            className += ' border-b-2 border-b-black';
          } else if (col === dividendStartCol + dividendLength) {
            className += ' border-r border-gray-300';
          }
        }
        // Rows 3+: Empty for calculation
        else {
          if (col === 0) {
            className += ' bg-gray-50';
          } else if (col === dividendStartCol + dividendLength) {
            className += ' border-r border-gray-300';
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
      className="print-break-inside-avoid inline-block border border-gray-300"
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
