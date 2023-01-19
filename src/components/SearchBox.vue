<template>
  <div class="search-box">
    <form @submit.prevent="tpToSearch">
      <div>
        Quel est le
        <select :value="doctorType" @change="$emit('update:doctorType', ($event.target as HTMLSelectElement).value)">
          <option value="all">-- Tous --</option>
          <option v-for="(value, key) in colorsLegend" :key="key" :value="key">
            {{ value }}
          </option>
        </select>
        le plus proche
      </div>
      <div>du <input v-model="addrInput" type="search" placeholder="25 rue de la Fonderie, 68200 Mulhouse" /> ?</div>
      <div><em>Vous pouvez entrer une adresse ou cliquer sur le plan.</em></div>
    </form>
  </div>
</template>

<script lang="ts" setup>
import { ref, defineProps, defineEmits } from 'vue';
import { colorsLegend } from '../colors';
import { map, marker } from '../map';

defineProps({
  doctorType: String
});
const emit = defineEmits(['update:doctorType', 'flied']);

const addrInput = ref('');
const error = ref(false);

async function tpToSearch() {
  const url = new URL('https://api-adresse.data.gouv.fr/search/');
  url.searchParams.set('q', addrInput.value);
  url.searchParams.set('limit', '1');
  const res = await fetch(url).then(res => res.json());
  if (!res.features[0]) {
    error.value = true;
    return;
  }
  error.value = false;
  addrInput.value = res.features[0].properties.label;
  map.flyTo({
    center: res.features[0].geometry.coordinates,
    zoom: 13
  });
  map.once('idle', () => emit('flied'));
  marker.setLngLat(res.features[0].geometry.coordinates);
}
</script>

<style scoped>
.search-box {
  position: fixed;
  top: 10px;
  left: 10px;

  padding: 8px;
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.9);

  background-color: white;
  color: black;

  border-radius: 8px;
}
.search-box > form {
  display: flex;
  flex-direction: column;
  gap: 0.25em;
}
.search-box div {
  display: flex;
  gap: 0.4ch;
}
.search-box input {
  flex: 1 0;
}
</style>


