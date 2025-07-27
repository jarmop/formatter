function countCells(row: string) {
  return row.match(/\t/g)?.length || 0;
}

export function tsvToArray(text: string) {
  const stringRows = text.trim().split("\n");
  const keyCount = Math.max(...stringRows.map(countCells));

  const firstValueRowIndex = countCells(stringRows[0]) === keyCount
    ? 1
    : stringRows.findIndex((r) => countCells(r) === keyCount);
  const keyRow = stringRows.slice(0, firstValueRowIndex).join("\n").split("\t");

  const rows = stringRows.slice(firstValueRowIndex).map((r) => r.split("\t"));

  const valueRows: string[][] = [];
  let validRowIndex = 0;
  rows.forEach((rawRow) => {
    const row = rawRow.filter((cell) => !cell.includes("mathbb"));
    if (row.length > 1) {
      valueRows.push(row);
      validRowIndex = valueRows.length - 1;
    } else if (row.length === 1) {
      const validRow = valueRows[validRowIndex];
      validRow[validRow.length - 1] += ` ${row[0]}`;
    }
  });

  return [keyRow, ...valueRows];
}

export function matrixToArrayOfObjects(rows: string[][]) {
  function fixValueType(value: string) {
    if (isNaN(Number(value))) {
      return value;
    } else if (Number.isInteger(value)) {
      return parseInt(value);
    }
    return parseFloat(value);
  }

  const keys: string[] = [];
  const colspans: Record<string, number> = {};
  rows[0].forEach((key) => {
    if (key !== "") {
      keys.push(key);
      colspans[key] = 1;
    } else {
      const lastKey = keys[keys.length - 1];
      colspans[lastKey]++;
    }
  });

  const data = rows.slice(1).map((values) => {
    const obj: Record<string, unknown> = {};
    let valueIndex = 0;
    keys.forEach((key) => {
      const colspan = colspans[key];
      if (colspan > 1) {
        obj[key] = values.slice(valueIndex, valueIndex + colspan).filter(
          (value) => value !== "",
        ).map(fixValueType);
        valueIndex += colspan;
      } else {
        obj[key] = fixValueType(values[valueIndex]);
        valueIndex++;
      }
    });

    return obj;
  });

  return data;
}

export function tryParseJSON(str: string) {
  // First, ensure the input is actually a string and not empty.
  if (typeof str !== "string" || str.trim().length === 0) {
    return false;
  }

  try {
    return JSON.parse(str);
  } catch (_) {
    // console.info("not valid JSON");s
    return false;
  }
}
