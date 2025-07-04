// Store de Pinia para gestionar las listas del usuario (watchlist, watched, favorites)
// Permite acceder y modificar las listas desde cualquier parte de la app

import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useMyShowsStore = defineStore('myShows', () => {
  const watchlist = ref<{ content_id: string; type: string }[]>([])
  const watched = ref<{ content_id: string; type: string }[]>([])
  const favorites = ref<{ content_id: string; type: string }[]>([])
  const loading = ref(false)

  // Cargar listas del backend
  async function fetchLists(userId: string) {
    loading.value = true
    try {
      const res = await fetch(`http://localhost:3002/api/user-content/${userId}`)
      const data = await res.json()
      watchlist.value = data.watchlist || []
      watched.value = data.watched || []
      favorites.value = data.favorites || []
    } catch (e) {
      watchlist.value = []
      watched.value = []
      favorites.value = []
    } finally {
      loading.value = false
    }
  }

  // Agregar show a una lista
  async function addToList(userId: string, contentId: string, status: string, type: string) {
    await fetch('http://localhost:3002/api/user-content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, contentId, status, type }),
    })
    await fetchLists(userId)
  }

  // Eliminar show de una lista
  async function removeFromList(userId: string, contentId: string, status: string) {
    await fetch('http://localhost:3002/api/user-content', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, contentId, status }),
    })
    await fetchLists(userId)
  }

  return {
    watchlist,
    watched,
    favorites,
    loading,
    fetchLists,
    addToList,
    removeFromList,
  }
})
