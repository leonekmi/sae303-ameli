import { readFile, writeFile } from "node:fs/promises";

const cnam = JSON.parse(await readFile("cnam.json", "utf8"));

const array = [
  "index,adresse,cp",
  ...cnam.map((doc, i) =>
    [i, doc.place.addr.replace(/[,"']/g, " "), doc.place.cp].join(",")
  ),
];

await writeFile("cnam_ban.csv", array.join("\n"), "utf8");
