import { useState } from "react";
import "./App.css";

function App() {
  const [input, setInput] = useState(
    "",
    // "Methyl dehydroabietate: 22.44%\nDehydroabietic acid: 14.59%\nRetene (7-isopropyl-1-methylphenanthrene): 10.08%\nIsopimaral: 6.18%\nPimaral: 4.71%\nAbietic acid: 4.23%\nPimaric acid: 3.59%\n18-Norabieta-8,11,13-triene: 3.50%\n2,3,5-Trimethylphenanthrene: 1.72%\nLevoglucosan: 1.44%",
  );
  const [output, setOutput] = useState("");

  function isValidJSIdentifier(str: string) {
    // Regular expression to match valid JavaScript identifiers
    // ^[a-zA-Z_$] ensures the first character is a letter, underscore, or dollar sign
    // [a-zA-Z0-9_$]* ensures subsequent characters are alphanumeric, underscore, or dollar sign
    // $ ensures the string ends after the valid identifier characters
    const identifierRegex = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/;
    return identifierRegex.test(str);
  }

  function objectToString(json: object) {
    let jsonString = "{\n";

    Object.entries(json).forEach(([key, value]) => {
      const formattedKey = isValidJSIdentifier(key) ? key : `"${key}"`;
      const formattedValue = typeof value === "string" ? `"${value}"` : value;
      jsonString += `  ${formattedKey}: ${formattedValue},\n`;
    });
    jsonString += "}";

    return jsonString;
  }

  function listToObject(list: string) {
    const rows = list.trim().split("\n");
    const json: Record<string, string> = {};
    rows.forEach((row) => {
      const [key, value] = row.split(":");
      json[key] = value.trim();
    });

    return json;
  }

  return (
    <>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 10,
        }}
      >
        <textarea
          id="input"
          name="input"
          style={{ height: 300, width: "100%" }}
          value={input}
          onChange={(e) => {
            const value = e.target.value;
            setInput(value);
            const object = listToObject(value);
            const objectString = objectToString(object);
            setOutput(objectString);
            try {
              navigator.clipboard.writeText(objectString).then(() =>
                console.log("Content copied to clipboard successfully!")
              );
            } catch (err) {
              console.error("Failed to copy content: ", err);
            }
          }}
        >
        </textarea>
      </div>
      <pre>{output}</pre>
    </>
  );
}

export default App;
