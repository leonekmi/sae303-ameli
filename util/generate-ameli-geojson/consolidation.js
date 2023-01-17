// Generate the final GeoJSON
import { parse } from "csv-parse";
import { createReadStream, writeFile } from "node:fs";
import { readFile } from "node:fs/promises";

const geojson = {
  type: "FeatureCollection",
  features: [],
};

const database = {};

const cnam = JSON.parse(await readFile("cnam.json", "utf8"));

const parser = parse({
  delimiter: ",",
  columns: true,
});

parser.on("readable", () => {
  let record;
  while ((record = parser.read()) !== null) {
    if (record.result_status !== "ok") continue;
    geojson.features.push({
      id: parseInt(record.index),
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [parseFloat(record.longitude), parseFloat(record.latitude)],
      },
      properties: {
        ...cnam[parseInt(record.index)]
      }
    });
    database[record.index] = cnam[parseInt(record.index)];
  }
});

parser.on("end", () => {
  console.log("finito");
  const end = JSON.stringify(geojson, undefined, 2);
  const end_db = JSON.stringify(database);
  writeFile("cnam.full.geo.json", end, "utf8", () => console.log("Fichier !"));
  // writeFile("cnam.data.json", end_db, "utf8", () => console.log("Fichier !"));
});

createReadStream("cnam_ban.geocoded.csv").pipe(parser);
