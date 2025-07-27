const parser = new DOMParser();

export function tryParseHTML(str: string) {
  if (!str || str.trim()[0] !== "<") {
    return false;
  }
  const doc = parser.parseFromString(
    str.replaceAll("<br>", " ").replaceAll("\n", ""),
    "text/html",
  );

  // Remove citations
  doc.querySelectorAll('[id^="cite_ref"]').forEach((c) => c.remove());

  const headers = doc.querySelectorAll("thead tr th").values().toArray().map(
    (node) => node.textContent || "",
  );

  const values = doc.querySelectorAll("tbody tr").values().toArray().map(
    (node) =>
      node.querySelectorAll("th, td").values().toArray().map((
        node,
      ) => {
        return node.textContent || "";
      }),
  );

  return [headers, ...values];
}
