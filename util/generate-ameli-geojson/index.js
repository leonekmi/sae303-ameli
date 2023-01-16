import { parse } from "csv-parse";
import { createReadStream, writeFile } from "node:fs";

const cnam = [];

const numberColumns = ["pro", "exercice", "nature", "jour"];

const conventions = Object.freeze({
  c1: 1,
  c2: 2,
  c3: 3,
  nc: 0,
});

const parser = parse({
  delimiter: ";",
  quote: null,
  autoParse: false,
  columns: [
    "c",
    "nom",
    "prenom",
    "adresse1",
    "adresse2",
    "adresse3",
    "adresse4",
    "adresse5",
    "adresse6",
    "tel",
    "pro",
    "exercice",
    "nature",
    "conv",
    "opt",
    "sesam",
    "type",
    "consult",
    "debut",
    "fin",
    "jour",
  ],
  cast(value, context) {
    if (numberColumns.includes(context.column)) return parseInt(value);
    else if (context.column === "conv") return conventions[value];
    else if (context.column === "c") return value === "F" ? 2 : 1;
    else return value;
  },
});

function formatAdresse(...blocAdresse) {
  const ville = blocAdresse.at(-1);
  const cp = blocAdresse.at(-2);
  const blocs = blocAdresse
    .slice(0, -2)
    .filter((x) => !!x)
    .join(", ");
  return { ville, cp, addr: blocs };
}

function removeNullProps(obj) {
  return Object.fromEntries(Object.entries(obj).filter(([k, v]) => v !== null));
}

function makeDoctor({
  adresse1,
  adresse2,
  adresse3,
  adresse4,
  adresse5,
  adresse6,
  type,
  consult = "non_r",
  debut,
  fin,
  jour,
  ...doc
}) {
  return removeNullProps({
    ...doc,
    opt: undefined,
    sesam: undefined,
    place: formatAdresse(
      adresse1,
      adresse2,
      adresse3,
      adresse4,
      adresse5,
      adresse6
    ),
    ...(debut
      ? {
          horaires: [{ type, consult, debut, fin, jour }],
        }
      : {
          horaires: [],
        }),
  });
}

parser.on("readable", () => {
  let record;
  while ((record = parser.read()) !== null) {
    const previous = cnam.at(-1);
    if (
      previous &&
      previous.nom === record.nom &&
      previous.prenom === record.prenom
    ) {
      if (record.debut)
        previous.horaires.push({
          type: record.type,
          consult: record.consult || "non_r",
          debut: record.debut,
          fin: record.fin,
          jour: record.jour,
        });
    } else {
      cnam.push(makeDoctor(record));
    }
  }
});

parser.on("end", () => {
  console.log("finito");
  console.log(cnam.length);
  const end = JSON.stringify(cnam, undefined);
  writeFile("cnam.json", end, "utf8", () => console.log("Fichier !"));
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
  // console.log(newCnam.length);
});

parser.on("error", console.error);

createReadStream(process.argv[2]).pipe(parser);
