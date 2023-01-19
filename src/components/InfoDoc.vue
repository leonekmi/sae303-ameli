<template>
  <div class="info-doc" v-if="doc">
    <h1>{{ doc.c === 1 ? 'M.' : 'Mme' }} {{ doc.prenom }} {{ doc.nom }}</h1>
    <p>{{ professionsLabels[doc.pro] }}<template v-if="doc.tel">&nbsp;/ Téléphone&nbsp;: {{ doc.tel }}</template></p>
    <p>{{ doc.place.addr }}<br />{{ doc.place.cp }} {{ doc.place.ville }}</p>
    <p>
      <a
        href="https://www.service-public.fr/particuliers/vosdroits/F17042"
        target="_blank"
      >
        {{ convention }}
      </a>
    </p>
    <p v-if="doc.horaires.length > 0">
      Horaires d'ouverture&nbsp;:
      <ul>
        <li v-for="(horaire, jour) in horaires" :key="jour">
          {{ jour }}&nbsp;: <template v-if="horaire.length > 0">
            <template v-for="(creneau, key) in horaire" :key="key">
              {{ creneau.debut }}-{{ creneau.fin }}
              <template v-if="creneau.consult">
                ({{ creneau.consult }})
              </template>
              <template v-if="key !== (horaire.length - 1)"> / </template>
            </template>
          </template>
          <template v-else>
            <em>Fermé</em>
          </template>
        </li>
      </ul>
    </p>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { CNAMData, professionsLabels } from '../types';

const props = defineProps<{ doc?: CNAMData }>();

const convention = computed(() => {
  switch (props.doc?.conv) {
    case 0:
      return 'Non conventionné (secteur 3)';
    case 1:
      return 'Conventionné secteur 1';
    case 2:
      return 'Conventionné secteur 1 avec droit au dépassement permanent';
    case 3:
      return 'Conventionné secteur 2';
    default:
      return 'Convention inconnue';
  }
});

const horaires = computed(() => {
  if (!props.doc?.horaires || props.doc.horaires.length === 0) return;
  else {
    const horaires_doc = props.doc.horaires.filter(h => h.type === 'co').map(h => ({
      ...h,
      consult: {'non_r': '', 'ss_rdv': 'Sans rendez-vous', 'avc_rdv': 'Sur rendez-vous', 'a_dom': 'À domicile'}[h.consult]
    }));
    return {
      Lundi: horaires_doc.filter(h => h.jour === 1),
      Mardi: horaires_doc.filter(h => h.jour === 2),
      Mercredi: horaires_doc.filter(h => h.jour === 3),
      Jeudi: horaires_doc.filter(h => h.jour === 4),
      Vendredi: horaires_doc.filter(h => h.jour === 5),
      Samedi: horaires_doc.filter(h => h.jour === 6),
      Dimanche: horaires_doc.filter(h => h.jour === 7),
    }
  }
});
</script>

<style scoped>
.info-doc {
  position: fixed;
  bottom: 10px;
  left: 10px;

  padding: 8px;
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.9);

  background-color: white;
  color: black;

  border-radius: 8px;
  max-height: 50vh;
  overflow-y: auto;
}

h1 {
  margin: 0;
}

p {
  margin: 0.5rem 0;
}
</style>
