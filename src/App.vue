<template></template>

<script lang="ts" setup>
import {
  ExpressionInputType,
  ExpressionSpecification,
  Map as Maplibre,
} from 'maplibre-gl';
import { colors } from './colors';
import nearestPoint from '@turf/nearest-point';

const map = new Maplibre({
  container: 'map',
  style: 'https://france.leonekmi.fr/styles/france/style.json',
  bounds: [
    [-6.152, 51.511],
    [10.679, 41.117],
  ],
});

map.once('load', () => {
  console.log('loaded!');

  map.addSource('cnam', {
    type: 'vector',
    url: 'https://france.leonekmi.fr/data/cnam-tippecanoe.json',
  });

  map.addLayer(
    {
      id: 'heatmap-cnam',
      type: 'heatmap',
      source: 'cnam',
      'source-layer': 'cnam',
      maxzoom: 13,
      paint: {
        'heatmap-color': [
          'interpolate',
          ['linear'],
          ['heatmap-density'],
          0,
          'rgba(0, 201, 90, 0)',
          0.1,
          '#00C95A',
          0.4,
          '#E36214',
          1,
          '#820933',
        ],
        // Adjust the heatmap radius by zoom level
        'heatmap-radius': [
          'interpolate',
          ['linear'],
          ['zoom'],
          0,
          0,
          7,
          5,
          13,
          12,
        ],
        'heatmap-opacity': ['interpolate', ['linear'], ['zoom'], 11, 1, 13, 0],
      },
    },
    'place_label_other'
  );

  // map.addLayer(
  //   {
  //     id: 'point-cnam',
  //     type: 'circle',
  //     source: 'cnam',
  //     'source-layer': 'cnam',
  //     minzoom: 12,
  //     paint: {
  //       'circle-opacity': ['interpolate', ['linear'], ['zoom'], 12, 0, 14, 1],
  //       'circle-color': [
  //         'case',
  //         ...Object.entries(colors).flatMap(([color, pros]) => {
  //           return [['in', ['get', 'pro'], ['literal', pros]], color];
  //         }) as [ExpressionSpecification, ExpressionInputType, ...(ExpressionSpecification | ExpressionInputType)[]],
  //         // Par défaut
  //         'gray',
  //       ],
  //       'circle-stroke-opacity': ['interpolate', ['linear'], ['zoom'], 12, 0, 14, 1],
  //       'circle-stroke-width': 1,
  //     },
  //   },
  //   'place_label_other'
  // );

  Object.entries(colors).forEach(([color, pros]) => {
    map.addLayer({
      id: `circle-cnam-${color}`,
      type: 'circle',
      source: 'cnam',
      'source-layer': 'cnam',
      minzoom: 12,
      filter: ['in', ['get', 'pro'], ['literal', pros]],
      paint: {
        'circle-opacity': ['interpolate', ['linear'], ['zoom'], 12, 0, 14, 1],
        'circle-color': color,
        'circle-stroke-opacity': [
          'interpolate',
          ['linear'],
          ['zoom'],
          12,
          0,
          14,
          1,
        ],
        'circle-stroke-width': 1,
      },
    });
  });
});

map.on('click', 'point-cnam', (ev) => {
  console.log(ev.features);
  if (ev.features) {
    alert(JSON.stringify(ev.features[0]));
  }
});

map.on('click', (ev) => {
  console.log(
    'nearest!',
    nearestPoint(ev.lngLat.toArray(), {
      type: 'FeatureCollection',
      features: map.querySourceFeatures('cnam', {
        sourceLayer: 'cnam',
        filter: ['==', ['get', 'pro'], 43],
      }) as GeoJSON.Feature<GeoJSON.Point>[],
    })
  );
});

// @ts-ignore
window.hello = map;
</script>
