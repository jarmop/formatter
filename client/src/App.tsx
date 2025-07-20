import { useState } from "react";
import "./App.css";
import { tsvToArray } from "./tsvToArray.ts";
import { js_beautify } from "js-beautify";

const test = `
Euronorm (EN) number[6]	EN designation	AISI grade[7]	C	Cr	Mo	Ni	Others	Melts at[8]	Remark
1.4310	X10CrNi18-8	301	0.10	17.5	NS	8	NS	1420	For springs
1.4301	X5CrNi18-10	304	< 0.07	18.5	NS	9	NS	1450	A very common austenitic stainless steel grade
1.4307	X2CrNi18-9	304L	< 0.030	18.5	NS	9	NS	1450	Similar to the above but not susceptible to intergranular corrosion thanks to a lower C content.
1.4305	X8CrNiS18-9 e	303	< 0.10	18	NS	9	0.3	1420	Sulphur is added to improve machinability.
1.4541	X6CrNiTi18-10	321	< 0.08	18	NS	10.5	Ti: 5×C ≤ 0.70	1425	Same as grade 1.4301 but not susceptible to intergranular corrosion thanks to Ti which "traps" C.
1.4401	X5CrNiMo17-12-2	316	< 0.07	17.5	2.2	11.5	NS	1400	Second best known austenitic grade. Mo increases the corrosion resistance.
1.4404	X2CrNiMo17-12-2	316L	< 0.030	17.5	2.25	11.5	NS	1400	Same as above but not susceptible to intergranular corrosion thanks to a lower C content.
1.4571	X6CrNiMoTi17-12-2	316Ti	< 0.08	17.5	2.25	12	Ti: 5×C ≤ 0.70		
`;

const test2 =
  "Methyl dehydroabietate: 22.44%\nDehydroabietic acid: 14.59%\nRetene (7-isopropyl-1-methylphenanthrene): 10.08%\nIsopimaral: 6.18%\nPimaral: 4.71%\nAbietic acid: 4.23%\nPimaric acid: 3.59%\n18-Norabieta-8,11,13-triene: 3.50%\n2,3,5-Trimethylphenanthrene: 1.72%\nLevoglucosan: 1.44%";

function App() {
  const [input, setInput] = useState(
    test,
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

  function arrayToString(arr: object[]) {
    return js_beautify(JSON.stringify(arr));
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

          let jsValueString: string;
          if (value.includes("\t")) {
            const jsValue = tsvToArray(value);
            jsValueString = arrayToString(jsValue);
          } else {
            const jsValue = listToObject(value);
            jsValueString = objectToString(jsValue);
          }

          setOutput(jsValueString);

          try {
            navigator.clipboard.writeText(jsValueString).then(() =>
              console.log("Content copied to clipboard successfully!")
            );
          } catch (err) {
            console.error("Failed to copy content: ", err);
          }
        }}
      >
      </textarea>
      <pre>{output}</pre>
    </>
  );
}

export default App;
