<script setup>
const { data: trainers } = await useTrainers();
</script>

<template>
  <div>
    <h1>つづきからはじめる</h1>
    <nuxt-link to="/">ポケモンセンター に もどる</nuxt-link>
    <GamifyList>
      <GamifyItem v-for="trainer in trainers" :key="trainer">
        <NuxtLink :to="`/trainer/${trainer}`">{{ trainer }}</NuxtLink>
      </GamifyItem>
    </GamifyList>
  </div>
</template>
