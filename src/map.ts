import {
  ExpressionInputType,
  ExpressionSpecification,
  GeoJSONSource,
  GeolocateControl,
  Map as Maplibre,
  Marker,
  NavigationControl,
  Popup,
} from 'maplibre-gl';
import { colors } from './colors';

export const map = new Maplibre({
  container: 'map',
  style: 'https://france.leonekmi.fr/styles/france/style.json',
  bounds: [
    [-6.152, 51.511],
    [10.679, 41.117],
  ],
  hash: true,
});

map.addControl(
  new GeolocateControl({
    positionOptions: {
      enableHighAccuracy: true,
    },
    showAccuracyCircle: false,
  })
);

map.addControl(
  new NavigationControl({
    visualizePitch: true,
  })
);

export const emptyGeoJSON = Object.freeze({
  type: 'FeatureCollection',
  features: [],
});

map.once('load', () => {
  map.addSource('line', {
    type: 'geojson',
    data: emptyGeoJSON,
  });

  map.addLayer({
    id: 'line-to-doctor',
    type: 'line',
    source: 'line',
    layout: {
      'line-join': 'round',
      'line-cap': 'round',
    },
    paint: {
      'line-color': '#888',
      'line-width': 8,
    },
  });

  map.addSource('cnam', {
    type: 'vector',
    url: 'https://france.leonekmi.fr/data/cnam-tippecanoe.json',
  });

  map.addLayer(
    {
      id: 'heatmap-cnam-all',
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

  map.addLayer(
    {
      id: 'circle-cnam-all',
      type: 'circle',
      source: 'cnam',
      'source-layer': 'cnam',
      minzoom: 12,
      paint: {
        'circle-opacity': ['interpolate', ['linear'], ['zoom'], 12, 0, 14, 1],
        'circle-color': [
          'case',
          ...(Object.entries(colors).flatMap(([color, pros]) => {
            return [['in', ['get', 'pro'], ['literal', pros]], color];
          }) as [
            ExpressionSpecification,
            ExpressionInputType,
            ...(ExpressionSpecification | ExpressionInputType)[]
          ]),
          // Par défaut
          'gray',
        ],
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
    },
    'place_label_other'
  );

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

    map.addLayer(
      {
        id: `heatmap-cnam-${color}`,
        type: 'heatmap',
        source: 'cnam',
        'source-layer': 'cnam',
        maxzoom: 13,
        filter: ['in', ['get', 'pro'], ['literal', pros]],
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
          'heatmap-opacity': [
            'interpolate',
            ['linear'],
            ['zoom'],
            11,
            1,
            13,
            0,
          ],
        },
        layout: {
          visibility: 'none',
        },
      },
      'place_label_other'
    );
  });
});

export const markerPopup = new Popup({
  closeOnClick: false,
  closeOnMove: false,
});
// export const docPopup = new Popup();

export const marker = new Marker({
  rotationAlignment: 'viewport',
})
  .setLngLat([0, 0])
  .setPopup(markerPopup)
  .addTo(map);
