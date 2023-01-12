import { parse } from "csv-parse";
import { createReadStream } from "node:fs";

const cnam = [];

const parser = parse({
  delimiter: ";",
  quote: null,
  autoParse: false,
  columns: [
    "civilite",
    "nom",
    "prenom",
    "adresse1",
    "adresse2",
    "adresse3",
    "adresse4",
    "adresse5",
    "adresse6",
    "tel",
    "profession",
    "exercice",
    "nature",
    "convention",
    "opt",
    "sesam",
    "act",
    "consult",
    "debut",
    "fin",
    "jour",
  ],
});

parser.on("readable", () => {
  let record;
  while ((record = parser.read()) !== null) {
    const previous = cnam.at(-1);
    if (
      previous &&
      previous.nom === record.nom &&
      previous.prenom === record.prenom
    )
      continue;
    cnam.push(record);
  }
});

parser.on("end", () => {
  console.log("finito");
  console.log(cnam.length);
  //   const newCnam = cnam.filter((item, index, arr) => {
  //     return (
  //       index ===
  //       arr.findIndex(
  //         (i2) =>
  //           i2.civilite === item.civilite &&
  //           i2.nom === item.nom &&
  //           i2.prenom === item.prenom
  //       )
  //     );
  //   });
  console.log(newCnam.length);
});

parser.on("error", console.error);

createReadStream(process.argv[2]).pipe(parser);
