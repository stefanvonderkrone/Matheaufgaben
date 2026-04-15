interface EstimateGridProps {
  operation: 'addition' | 'subtraction' | 'multiplication';
  operand1: number;
  operand2: number;
  rounded1: number;
  rounded2: number;
  estimateResult: number;
  exactResult: number;
}

export function EstimateGrid({
  operation,
  operand1,
  operand2,
  rounded1,
  rounded2,
  estimateResult,
  exactResult,
}: EstimateGridProps) {
  const operator = operation === 'addition' ? '+' : operation === 'subtraction' ? '-' : '×';
  
  // Convert numbers to strings for display
  const op1Str = operand1.toString();
  const op2Str = operand2.toString();
  const rounded1Str = rounded1.toString();
  const rounded2Str = rounded2.toString();
  
  // Calculate result placeholder size
  // Both placeholders (exact and estimate) should be the same size
  // Include space for sign (+/-) - add 1 extra cell
  const exactResultStr = exactResult.toString();
  const estimateResultStr = estimateResult.toString();
  
  // Result length is max of both results + 1 for sign
  const maxResultLength = Math.max(exactResultStr.length, estimateResultStr.length);
  const resultPlaceholderLength = maxResultLength + 1; // +1 for sign
  
  // Calculate the exact line: AAAA+BBBB=_____ (with placeholder)
  const exactLineLength = op1Str.length + 1 + op2Str.length + 1 + resultPlaceholderLength;
  
  // Calculate the estimate line: AAAA+BBBB=_____ (with rounded values and placeholder)
  const estimateLineLength = rounded1Str.length + 1 + rounded2Str.length + 1 + resultPlaceholderLength;
  
  // Determine max length needed
  const maxLineLength = Math.max(exactLineLength, estimateLineLength);
  
  // Grid layout:
  // - Col 0: empty (left margin)
  // - Col 1: "Ü:" or "≈"
  // - Col 2: empty (spacing)
  // - Col 3+: the equation
  // Total columns = 1 (left margin) + 1 (label) + 1 (spacing) + maxLineLength
  const cols = 3 + maxLineLength;
  
  // Rows:
  // - Row 0: empty (top margin)
  // - Row 1: "Ü:" line - exact numbers with underlined placeholder for result
  // - Row 2: empty (spacing)
  // - Row 3: "≈" line - rounded values with underlined placeholders
  // - Row 4: empty (bottom margin)
  const rows = 5;
  
  // Generate grid cells
  const generateCells = () => {
    const cells = [];
    
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        let content = '';
        let className = 'w-8 h-8 sm:w-10 sm:h-10 print:w-[6mm] print:h-[6mm] border border-gray-300 flex items-center justify-center text-lg sm:text-xl print:text-[10pt] font-semibold';
        
        // Column 0 and last column: left and right margins (always empty/gray)
        if (col === 0 || col === cols - 1) {
          className += ' bg-gray-50';
        }
        // Row 0 and last row: top and bottom margins (always empty/gray)
        else if (row === 0 || row === rows - 1) {
          className += ' bg-gray-50';
        }
        // Row 1: "Ü:" line - exact numbers with underlined placeholder for result
        else if (row === 1) {
          if (col === 1) {
            // "Ü:" label
            content = 'Ü:';
            className += ' text-xs text-gray-600 print:text-[8pt]';
          } else if (col === 2) {
            // Spacing column
            className += ' bg-gray-50';
          } else {
            // Content starts at col 3
            const contentStartCol = 3;
            const contentCol = col - contentStartCol;
            
            if (contentCol < op1Str.length) {
              // First operand digits
              content = op1Str[contentCol];
            } else if (contentCol === op1Str.length) {
              // Operator
              content = operator;
              className += ' text-gray-600';
            } else if (contentCol < op1Str.length + 1 + op2Str.length) {
              // Second operand digits
              const digitIndex = contentCol - (op1Str.length + 1);
              content = op2Str[digitIndex];
            } else if (contentCol === op1Str.length + 1 + op2Str.length) {
              // Equals sign
              content = '=';
              className += ' text-gray-600';
            } else if (contentCol < exactLineLength) {
              // Result placeholder - underlined for student to fill
              content = '';
              className += ' bg-white border-b-2 border-b-black';
            } else {
              // Beyond the equation
              className += ' bg-gray-50';
            }
          }
        }
        // Row 2: spacing row
        else if (row === 2) {
          className += ' bg-gray-50';
        }
        // Row 3: "≈:" line - rounded values with underlined placeholders
        else if (row === 3) {
          if (col === 1) {
            // "≈:" label
            content = '≈:';
            className += ' text-xs text-gray-600 print:text-[8pt]';
          } else if (col === 2) {
            // Spacing column
            className += ' bg-gray-50';
          } else {
            // Content starts at col 3
            const contentStartCol = 3;
            const contentCol = col - contentStartCol;
            
            if (contentCol < rounded1Str.length) {
              // First rounded operand - placeholder with bold underline
              content = '';
              className += ' bg-white border-b-2 border-b-black';
            } else if (contentCol === rounded1Str.length) {
              // Operator
              content = operator;
              className += ' text-gray-600';
            } else if (contentCol < rounded1Str.length + 1 + rounded2Str.length) {
              // Second rounded operand - placeholder with bold underline
              const digitIndex = contentCol - (rounded1Str.length + 1);
              if (digitIndex < rounded2Str.length) {
                content = '';
                className += ' bg-white border-b-2 border-b-black';
              }
            } else if (contentCol === rounded1Str.length + 1 + rounded2Str.length) {
              // Equals sign
              content = '=';
              className += ' text-gray-600';
            } else if (contentCol < estimateLineLength) {
              // Estimate result - placeholder with bold underline
              content = '';
              className += ' bg-white border-b-2 border-b-black';
            } else {
              // Beyond the equation
              className += ' bg-gray-50';
            }
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
