<script setup lang="ts">
import { ref, onMounted } from 'vue'
import SearchBar from '../components/SearchBar.vue'
import MediaSection from '../components/MediaSection.vue'
import { useSearch } from '../composables/useSearch'
import { searchTheTVDB, type MediaItem } from '@/services/thetvdbService'
import { batchSearchTheTVDBExact } from '@/services/thetvdbService'

const recommendedMovies = ref<MediaItem[]>([])
const popularSeries = ref<MediaItem[]>([])

const { searchQuery, searchResults, isLoading, search } = useSearch()

const handleSearch = (query: string) => {
  search(query)
}

onMounted(async () => {
  recommendedMovies.value = (
    await batchSearchTheTVDBExact([
      'Interstellar',
      'Joker',
      'Batman',
      'Mugen Train',
      'Ted',
      'Project X',
      'Spider Man',
      'Venom',
      'Rango',
      'Scarface',
      'World War Z',
      'Ted 2',
    ])
  ).map((item) => ({ ...item, type: 'movie' as const }))
  console.log('Recommended movies:', recommendedMovies.value)

  popularSeries.value = (
    await batchSearchTheTVDBExact([
      'Breaking Bad',
      'The Boys',
      'The Last of Us',
      'The Walking Dead',
      'You',
      'The Bear',
      'Wednesday',
      'Death Note',
      'Servant',
      'Cobra Kai',
      'Chernobyl',
      'Tokyo Ghoul',
    ])
  ).map((item) => ({ ...item, type: 'series' as const }))
  console.log('Popular series:', popularSeries.value)
})
</script>

<template>
  <div class="container">
    <SearchBar @search="handleSearch" />

    <MediaSection
      v-if="searchQuery && searchResults.length > 0"
      title="Search results"
      :items="searchResults"
    />
    <template v-else>
      <MediaSection title="Recommended movies" :items="recommendedMovies" :infinite="true" />
      <MediaSection title="Popular TV series" :items="popularSeries" :infinite="true" />
    </template>
  </div>
</template>

<style scoped>
.container {
  padding: 20px;
  padding-bottom: 80px;
  max-width: 1400px;
  margin: 0 auto;
}
</style>
