<template>
  <div class="hello">
    <h1>
      Connaissez-vous vraiment l'offre de santé proche de chez vous&nbsp;?
    </h1>
    <p>
      Quel serait le cardiologue le plus proche ? L'ORL le plus proche ?<br />
      Avez-vous pensé à ça quand vous avez emménagé ?<br />
      Les <strong>déserts médicaux</strong> sont souvent abordés dans les médias
      et représentent un problème de santé majeur.<br />
      Notre carte <strong>vous informe</strong>.
    </p>
    <button class="cta" @click="$emit('close')">Explorer</button>
    <p class="attribution">
      Leon Lozahic - SAÉ 3D03 -
      <a href="http://www.openmaptiles.org/" target="_blank">
        &copy; OpenMapTiles
      </a>&nbsp;- 
      <a href="http://www.openstreetmap.org/about/" target="_blank">
        &copy; OpenStreetMap contributors
      </a>&nbsp;- 
      <a href="https://www.data.gouv.fr/fr/datasets/annuaire-sante-de-la-cnam/" target="_blank">
        &copy; Cnam
      </a>
    </p>
  </div>
</template>

<style scoped>
.hello {
  position: fixed;
  height: 100vh;
  width: 100vw;
  top: 0;
  left: 0;
  background-color: rgba(93, 93, 93, 0.3);
  backdrop-filter: blur(10px) saturate(80%);
  text-shadow: 0 0 1px rgb(146, 146, 146);

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;

  font-size: 1.25rem;
  z-index: 10;
}

p {
  max-width: 800px;
}

.cta {
  cursor: pointer;
  background-color: #250286;
  color: white;
  border: none;
  font-size: 2rem;
  padding: 1rem 3rem;
  border-radius: 16px;
}

a, a:visited {
  color: black;
}
</style>
