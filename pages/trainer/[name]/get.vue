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
const onCatch = async (pokemon) => {
  const response = await fetch(
    `${config.backendOrigin}/api/trainer/${route.params.name}/pokemon/${pokemon.name}`,
    {
      method: "PUT",
    }
  );
  if (!response.ok) return;
  router.push(`/trainer/${route.params.name}`);
};
const { dialog, onOpen, onClose } = useDialog();

</script>

<template>
  <div>
    <h1>ポケモンをつかまえる</h1>
    <nuxt-link to="./">にげる</nuxt-link>
    <br>
    <GamifyItem>
      <GamifyButton @click="getRandomPokemon">ポケモン を さがす </GamifyButton>
    </GamifyItem>
    

    <GamifyItem v-if="pokemon">
      <h2>{{ pokemon.name }}</h2>
      <img :src="pokemon.image" alt="">
      <GamifyButton @click="onOpen(pokemon)">つかまえる</GamifyButton>
    </GamifyItem>
    
    <!--
      <GamifyDialog
      v-if="dialog"
      id="confirm-catch"
      title="かくにん"
      :description="`ほう！　${dialog.name}　にするんじゃな？`"
      @close="onClose"
    >
      <GamifyList :border="false" direction="horizon">
        <GamifyItem>
          <GamifyButton @click="onClose">いいえ</GamifyButton>
        </GamifyItem>
        <GamifyItem>
          <GamifyButton @click="onCatch(dialog)">はい</GamifyButton>
        </GamifyItem>
      </GamifyList>
    </GamifyDialog>
    -->
    
  </div>
</template>
