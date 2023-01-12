import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { Map as Maplibre } from 'maplibre-gl';

const map = new Maplibre({
    container: 'map',
    style: 'http://localhost:8080/styles/basic-preview/style.json'
});

createApp(App).mount('#app')
