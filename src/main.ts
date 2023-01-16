import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import { Map as Maplibre } from 'maplibre-gl';

const map = new Maplibre({
  container: 'map',
  style: 'https://france.leonekmi.fr/styles/france/style.json',
});

map.once('load', () => {
  console.log('loaded!');

  map.addSource('cnam', {
    type: 'geojson',
    data: '/cnam.geo.json',
  });

  map.addLayer({
    id: 'heatmap-cnam',
    type: 'heatmap',
    source: 'cnam',
    maxzoom: 12,
    paint: {
      // Adjust the heatmap radius by zoom level
      'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 0, 2, 17, 15],
      'heatmap-opacity': ['interpolate', ['linear'], ['zoom'], 10, 1, 12, 0],
    },
  });

  map.addLayer({
    id: 'point-cnam',
    type: 'circle',
    source: 'cnam',
    minzoom: 10,
    paint: {
      "circle-opacity": ['interpolate', ['linear'], ['zoom'], 10, 0, 12, 1],
      "circle-color": "blue"
    }
  });
});

createApp(App).mount('#app');
