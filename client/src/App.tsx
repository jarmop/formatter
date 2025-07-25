import { useEffect, useState } from "react";
import "./App.css";
import { matrixToArrayOfObjects, tsvToArray } from "./helpers.ts";
import { js_beautify } from "js-beautify";
import { complexTableTSV } from "./testData/index.ts";
import { TableView } from "./TableView.tsx";

function App() {
  const [input, setInput] = useState(
    complexTableTSV,
  );
  const [parsedData, setParsedData] = useState<
    string[][] | Record<string, string>
  >();

  useEffect(() => {
    if (input) {
      parse(input);
    }
  }, []);

  function isValidJSIdentifier(str: string) {
    // Regular expression to match valid JavaScript identifiers
    // ^[a-zA-Z_$] ensures the first character is a letter, underscore, or dollar sign
    // [a-zA-Z0-9_$]* ensures subsequent characters are alphanumeric, underscore, or dollar sign
    // $ ensures the string ends after the valid identifier characters
    const identifierRegex = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/;
    return identifierRegex.test(str);
  }

  function objectToString(object: object) {
    let jsonString = "{\n";

    Object.entries(object).forEach(([key, value]) => {
      const formattedKey = isValidJSIdentifier(key) ? key : `"${key}"`;
      const formattedValue = typeof value === "string" ? `"${value}"` : value;
      jsonString += `  ${formattedKey}: ${formattedValue},\n`;
    });
    jsonString += "}";

    return jsonString;
  }

  function arrayToString(arr: string[][]) {
    const arrayOfObjects = matrixToArrayOfObjects(arr);
    return js_beautify(JSON.stringify(arrayOfObjects));
  }

  function listToObject(list: string) {
    const rows = list.trim().split("\n");
    const object: Record<string, string> = {};
    rows.forEach((row) => {
      const [key, value] = row.split(":");
      object[key] = value.trim();
    });

    return object;
  }

  function parse(value: string) {
    if (value.includes("\t")) {
      setParsedData(tsvToArray(value));
    } else {
      setParsedData(listToObject(value));
    }
  }

  const output = parsedData
    ? Array.isArray(parsedData)
      ? arrayToString(parsedData)
      : objectToString(parsedData)
    : "";

  return (
    <>
      <textarea
        id="input"
        name="input"
        style={{ height: 300, width: "1000px" }}
        value={input}
        onChange={(e) => {
          const value = e.target.value;

          setInput(value);
          parse(value);

          // try {
          //   navigator.clipboard.writeText(jsValueString).then(() =>
          //     console.log("Content copied to clipboard successfully!")
          //   );
          // } catch (err) {
          //   console.error("Failed to copy content: ", err);
          // }
        }}
      >
      </textarea>
      {Array.isArray(parsedData) &&
        <TableView data={parsedData} />}
      <pre>{output}</pre>
    </>
  );
}

export default App;
