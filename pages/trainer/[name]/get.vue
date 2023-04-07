<template>
  <div>
    <button @click="getRandomPokemon">Get Random Pokemon</button>
    <div v-if="pokemon">
      <h2>{{ pokemon.name }}</h2>
      <img :src="pokemon.image" alt="">
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      pokemon: null
    }
  },
  methods: {
    async getRandomPokemon() {
      const randomId = Math.floor(Math.random() * 898) + 1; // 1 ~ 898のランダムなIDを生成
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
      const data = await res.json();
      const pokemon = {
        name: data.name,
        image: data.sprites.front_default
      };
      this.pokemon = pokemon;
    }
  }
}
</script>