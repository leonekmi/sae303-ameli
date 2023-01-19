<template>
  <Welcome v-if="welcome" @close="welcome = false" />
  <SearchBox
    v-model:doctor-type="doctorType"
    @flied="nearest(marker.getLngLat().toArray())"
  />
  <InfoDoc :doc="doc" />
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import 'maplibre-gl/dist/maplibre-gl.css';
import { emptyGeoJSON, map, marker, markerPopup } from './map';
import { colors, colorsLegend } from './colors';
import nearestPoint from '@turf/nearest-point';
import Welcome from './components/Welcome.vue';
import SearchBox from './components/SearchBox.vue';
import { lineString, Position } from '@turf/helpers';
import { GeoJSONSource } from 'maplibre-gl';
import InfoDoc from './components/InfoDoc.vue';
import { CNAMData } from './types';

const welcome = ref(
  ['', '#0/0/0', '#5.44/46.562/2.264'].includes(window.location.hash)
);
const doctorType = ref('all');
const doc = ref<CNAMData | undefined>(undefined);

function nearest(lngLat: Position) {
  marker.setLngLat(lngLat as [number, number]);
  if (doctorType.value === 'all') {
    markerPopup.setText(
      'Sélectionnez une spécialité en haut à gauche pour trouver le plus proche.'
    );
    if (!markerPopup.isOpen()) marker.togglePopup();
  }
  const feat = map.querySourceFeatures('cnam', {
    sourceLayer: 'cnam',
    filter:
      doctorType.value === 'all'
        ? []
        : ['in', ['get', 'pro'], ['literal', colors[doctorType.value]]],
  }) as GeoJSON.Feature<GeoJSON.Point>[];
  if (feat.length === 0) {
    map.easeTo({
      center: lngLat as [number, number],
      zoom: map.getZoom() - 1,
    });
    markerPopup.setText(
      `Il n'y a aucun ${
        colorsLegend[doctorType.value] || 'point'
      } sur cette portion de carte...`
    );
    (map.getSource('line') as GeoJSONSource).setData(emptyGeoJSON);
    map.once('idle', () => nearest(lngLat));
    return;
  }
  const point = nearestPoint(lngLat, {
    type: 'FeatureCollection',
    features: feat,
  });
  doc.value = {
    ...point.properties,
    horaires: JSON.parse(point.properties.horaires),
    place: JSON.parse(point.properties.place),
  } as unknown as CNAMData;
  const line = lineString([lngLat, point.geometry.coordinates]);
  markerPopup.setHTML(
    `<p>Ici, vous êtes à <strong>${point.properties.distanceToPoint.toLocaleString(
      'fr',
      {
        maximumFractionDigits: 2,
      }
    )}</strong> km du ${colorsLegend[doctorType.value] || 'professionnel de santé'} le plus proche.</p>`
  );
  if (!markerPopup.isOpen()) marker.togglePopup();
  (map.getSource('line') as GeoJSONSource).setData(line);
}

watch(doctorType, (newDoctor, oldDoctor) => {
  map.setLayoutProperty(`circle-cnam-${oldDoctor}`, 'visibility', 'none');
  map.setLayoutProperty(`heatmap-cnam-${oldDoctor}`, 'visibility', 'none');
  map.setLayoutProperty(`circle-cnam-${newDoctor}`, 'visibility', 'visible');
  map.setLayoutProperty(`heatmap-cnam-${newDoctor}`, 'visibility', 'visible');
  if (marker.getLngLat().toString() !== 'LngLat(0, 0)')
    nearest(marker.getLngLat().toArray());
});

map.once('idle', () => map.on('click', (ev) => nearest(ev.lngLat.toArray())));

markerPopup.on('close', () => {
  (map.getSource('line') as GeoJSONSource).setData(emptyGeoJSON);
  marker.setLngLat([0, 0]);
  doc.value = undefined;
});
</script>
