interface DivisionMitRestGridProps {
  dividend: number;
  divisor: number;
}

export function DivisionMitRestGrid({ dividend, divisor }: DivisionMitRestGridProps) {
  const dividendStr = dividend.toString();
  const dividendLength = dividendStr.length;

  // Grid dimensions: 16 columns x 14 rows
  const cols = 16;
  const rows = 14;

  // Calculate positions
  // "Ü" goes to (0,0)
  // Problem starts at row 2, col 1 (dividend)
  const problemRow = 2;
  const dividendStartCol = 1;
  // Divisor is placed after dividend + 2 columns (for "÷" and space)
  const divisorCol = dividendStartCol + dividendLength + 1;
  // Result area starts after divisor
  const resultStartCol = divisorCol + 2;

  // "P:" goes 8 rows below the problem (row 10), in the divisor column
  const pLabelRow = 10;
  const pLabelCol = divisorCol;

  // Generate grid cells
  const generateCells = () => {
    const cells = [];

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        let content = '';
        let className =
          'w-6 h-6 sm:w-8 sm:h-8 print:w-[5mm] print:h-[5mm] border border-gray-300 flex items-center justify-center text-base sm:text-lg print:text-[7pt] font-semibold';

        // Row 0: "Ü" in first cell only (no position labels)
        if (row === 0) {
          if (col === 0) {
            // "Ü" in top-left corner
            content = 'Ü';
            className += ' text-xs text-gray-600 print:text-[7pt]';
          } else {
            className += ' bg-gray-50';
          }
        }
        // Problem row: row 2
        else if (row === problemRow) {
          if (col === dividendStartCol - 1) {
            // Empty cell before dividend
            className += ' bg-gray-50';
          } else if (
            col >= dividendStartCol &&
            col < dividendStartCol + dividendLength
          ) {
            // Dividend digits
            const digitIndex = col - dividendStartCol;
            content = dividendStr[digitIndex];
          } else if (col === dividendStartCol + dividendLength) {
            // Space or separator
            className += ' bg-gray-50';
          } else if (col === divisorCol) {
            // Divisor
            content = divisor.toString();
          } else if (col === divisorCol + 1) {
            // Space
            className += ' bg-gray-50';
          } else if (col >= resultStartCol && col < resultStartCol + 6) {
            // Empty cells for result (student fills in)
            className += ' bg-white';
          } else {
            className += ' bg-gray-50';
          }
        }
        // "P:" label row: row 10
        else if (row === pLabelRow) {
          if (col === pLabelCol) {
            content = 'P:';
            className += ' text-xs text-gray-600 print:text-[7pt]';
          } else if (col < dividendStartCol) {
            className += ' bg-gray-50';
          } else if (col === dividendStartCol + dividendLength) {
            className += ' border-r border-gray-300';
          }
        }
        // Other rows
        else {
          if (col < dividendStartCol) {
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
