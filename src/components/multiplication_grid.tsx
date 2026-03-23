import { calculateChecksum } from '../utils/multiplication_generator';

interface MultiplicationGridProps {
  factor1: number;
  factor2: number;
}

export function MultiplicationGrid({ factor1, factor2 }: MultiplicationGridProps) {
  const factor1Str = factor1.toString();
  const factor1Length = factor1Str.length;
  const product = factor1 * factor2;
  const checksum = calculateChecksum(product);

  const cols = 9;
  const rows = 6;

  const positions = ['T', 'H', 'Z', 'E'];

  const factor1StartCol = 1;
  const operatorCol = factor1StartCol + factor1Length;
  const factor2Col = operatorCol + 1;
  const checksumCol = factor2Col + 1;
  const resultStartCol = checksumCol + 1;

  const generateCells = () => {
    const cells = [];

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        let content = '';
        let className = 'w-8 h-8 sm:w-10 sm:h-10 print:w-[6mm] print:h-[6mm] border border-gray-300 flex items-center justify-center text-lg sm:text-xl print:text-[8pt] font-semibold';

        if (row === 0) {
          if (col >= factor1StartCol && col < factor1StartCol + factor1Length) {
            const posIndex = 4 - factor1Length + (col - factor1StartCol);
            content = positions[posIndex] || '';
            className += ' text-xs text-gray-500 print:text-[8pt]';
          } else {
            className += ' bg-gray-50';
          }
        } else if (row === 1) {
          if (col === 0) {
            className += ' bg-gray-50';
          } else if (col >= factor1StartCol && col < factor1StartCol + factor1Length) {
            const digitIndex = col - factor1StartCol;
            content = factor1Str[digitIndex];
            className += ' border-b-2 border-b-black';
          } else if (col === operatorCol) {
            content = '·';
            className += ' border-b-2 border-b-black';
          } else if (col === factor2Col) {
            content = factor2.toString();
            className += ' border-b-2 border-b-black';
          } else if (col === checksumCol) {
            // Kein = mehr, nur leer mit border
            className += ' bg-white';
          } else if (col >= resultStartCol && col < resultStartCol + 3) {
            className += ' bg-white';
          } else {
            className += ' bg-gray-50';
          }
        } else if (row === 2) {
          if (col === checksumCol) {
            content = checksum.toString();
            className += ' text-xs text-gray-400 print:text-[7pt]';
          } else if (col === 0) {
            className += ' bg-gray-50';
          }
        } else {
          if (col === 0) {
            className += ' bg-gray-50';
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
