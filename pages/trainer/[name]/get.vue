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

<template>
  <div>
    <h1>ポケモンをつかまえる</h1>
    <nuxt-link to="./">にげる</nuxt-link>
    <br>
    <button @click="getRandomPokemon">ポケモン を さがす</button>
    <div v-if="pokemon">
      <h2>{{ pokemon.name }}</h2>
      <img :src="pokemon.image" alt="">
    </div>
  </div>
</template>
