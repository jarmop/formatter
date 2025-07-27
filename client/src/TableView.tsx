import { useState } from "react";
import "./TableView.css";

interface TableViewProps {
  rows: string[][];
  onChange: (newData: string[][]) => void;
}

export function TableView({ rows, onChange }: TableViewProps) {
  // const [rows, setRows] = useState(data);
  const keys = rows[0];
  const valueRows = rows.slice(1);

  const [cellRowSpan, setCellRowSpan] = useState(
    rows.map((row) => row.map(() => 1)),
  );
  const [cellColSpan, setCellColSpan] = useState(
    rows.map((row) => row.map(() => 1)),
  );
  const [selectedCell, setSelectedCell] = useState<[number, number]>();

  function selectCell(row: number, col: number) {
    setSelectedCell(isSelectedCell(row, col) ? undefined : [row, col]);
  }

  function incrementRowSpan(row: number, col: number, increment: number) {
    const newKeyRowspan = [...cellRowSpan];
    newKeyRowspan[row][col] = Math.max(1, newKeyRowspan[row][col] + increment);
    setCellRowSpan(newKeyRowspan);
  }

  function incrementColSpan(row: number, col: number, increment: number) {
    const newKeyColspan = [...cellColSpan];
    newKeyColspan[row][col] = Math.max(1, newKeyColspan[row][col] + increment);
    setCellColSpan(newKeyColspan);
  }

  function isSelectedCell(row: number, col: number) {
    if (!selectedCell) {
      return false;
    }
    return row === selectedCell[0] && col === selectedCell[1];
  }

  function deleteCell(selectedRow: number, selectedCol: number) {
    const newRow = rows[selectedRow].toSpliced(selectedCol, 1);
    const newRows = [
      ...rows.slice(0, selectedRow),
      newRow,
      ...rows.slice(selectedRow + 1),
    ];
    onChange(newRows);
  }

  function insertCell(selectedRow: number, selectedCol: number, value: string) {
    const row = [...rows[selectedRow]];
    const newRow = [
      ...row.slice(0, selectedCol),
      value,
      ...row.slice(selectedCol),
    ];
    const newRows = [
      ...rows.slice(0, selectedRow),
      newRow,
      ...rows.slice(selectedRow + 1),
    ];
    onChange(newRows);
  }

  function deleteColumn(col: number) {
    const newRows = rows.map((r) => r.toSpliced(col, 1));
    onChange(newRows);
  }

  return (
    <table
      style={{ borderCollapse: "collapse" }}
      className="TableView"
      tabIndex={0}
      onKeyDown={(e) => {
        const handledKeys = [
          "ArrowUp",
          "ArrowDown",
          "ArrowLeft",
          "ArrowRight",
          "Delete",
        ];
        if (!selectedCell || !handledKeys.includes(e.key)) {
          return;
        }
        e.preventDefault();

        if (e.shiftKey) {
          switch (e.key) {
            case "ArrowLeft":
              incrementColSpan(...selectedCell, -1);
              break;
            case "ArrowRight":
              incrementColSpan(...selectedCell, 1);
              break;
            case "ArrowUp":
              incrementRowSpan(...selectedCell, -1);
              break;
            case "ArrowDown":
              incrementRowSpan(...selectedCell, 1);
          }
        } else if (e.ctrlKey) {
          const [selectedRow, selectedCol] = selectedCell;
          const cellValue = rows[selectedRow][selectedCol];

          switch (e.key) {
            case "ArrowLeft": {
              // delete selected
              deleteCell(selectedRow, selectedCol);
              break;
            }
            case "ArrowRight": {
              // duplicate cell and shift right
              insertCell(selectedRow, selectedCol, cellValue);
              break;
            }
            case "ArrowUp":
              // delete below selected
              deleteCell(selectedRow + 1, selectedCol);
              break;
            case "ArrowDown":
              // duplicate cell and shift down
              insertCell(
                selectedRow + 1,
                selectedCol,
                cellValue,
              );
          }
        } else if (e.key === "Delete") {
          if (selectedCell[0] === 0) {
            deleteColumn(selectedCell[1]);
          }
        } else {
          const [selectedRow, selectedCol] = selectedCell;
          const rowSpan = cellRowSpan[selectedRow][selectedCol];

          switch (e.key) {
            case "ArrowLeft":
              selectCell(selectedRow, selectedCol - 1);
              break;
            case "ArrowRight":
              selectCell(selectedRow, selectedCol + 1);
              break;
            case "ArrowUp":
              selectCell(selectedRow - 1, selectedCol);
              break;
            case "ArrowDown":
              selectCell(selectedRow + rowSpan, selectedCol);
          }
        }
      }}
    >
      <thead>
        <tr>
          {keys.map((k, i) => (
            <th
              key={k}
              colSpan={cellColSpan[0][i]}
              rowSpan={cellRowSpan[0][i]}
              onClick={() => selectCell(0, i)}
              style={{
                cursor: "pointer",
                background: isSelectedCell(0, i) ? "lightblue" : "",
              }}
            >
              {k}
              {
                /* <CellEditor
                value={k}
                onIncrement={(increment) => incrementColspan(0, i, increment)}
              /> */
              }
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {valueRows.map((r, i) => (
          <tr key={i}>
            {r.map((c, j) => (
              <td
                key={j}
                rowSpan={cellRowSpan[i + 1][j]}
                colSpan={cellColSpan[i + 1][j]}
                onClick={() => selectCell(i + 1, j)}
                style={{
                  cursor: "pointer",
                  background: isSelectedCell(i + 1, j) ? "lightblue" : "",
                }}
              >
                {c}
                {
                  /* <CellEditor
                  value={c}
                  onIncrement={(increment) =>
                    incrementColspan(i + 1, j, increment)}
                /> */
                }
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

interface cellEditorProps {
  value: string;
  onIncrement: (increment: number) => void;
}

function CellEditor({ value, onIncrement }: cellEditorProps) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        textWrap: "nowrap",
      }}
    >
      {value}
      <div>
        <button
          type="button"
          onClick={() => onIncrement(-1)}
        >
          -
        </button>
        <button
          type="button"
          onClick={() => onIncrement(1)}
        >
          +
        </button>
      </div>
      {
        /* <input
        type="number"
        style={{ width: "30px", marginLeft: "5px" }}
        // value={keyColspan[i]}
        onChange={(e) => {
          // const newKeyColspan = [...keyColspan];
          // newKeyColspan[i] = parseInt(e.target.value);
          // setKeyColspan(newKeyColspan);
        }}
      /> */
      }
    </div>
  );
}
