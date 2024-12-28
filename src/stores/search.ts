import { defineStore } from 'pinia'
import type { ARSEntry, SearchState } from '../types/ars'

/**
 * Pinia store for managing search functionality
 * Handles loading ARS data, searching, and pagination
 */
export const useSearchStore = defineStore('search', {
  state: (): SearchState => ({
    // Lookup dictionary for ARS codes to region names
    arsMap: {},
    
    // Array of filtered search results
    searchResults: [],
    
    // Current search query string
    currentQuery: '',
    
    // Current pagination offset
    offset: 0,
    
    // Number of items to show per page
    pageSize: 30,
  }),

  actions: {
    /**
     * Loads the initial ARS data from the JSON file
     * Called when the application first initializes
     */
    async loadARSData() {
      try {
        const response = await fetch('ars_from_geojson.json')
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        this.arsMap = await response.json()
      } catch (error) {
        console.error('Failed to load ARS data:', error)
        // You might want to add error handling UI here
      }
    },

    /**
     * Updates the search query and resets pagination
     * @param query - The new search query string
     */
    updateSearch(query: string) {
      // Normalize the query string
      this.currentQuery = query.toLowerCase().trim()
      // Reset pagination when search changes
      this.offset = 0
      // Trigger new search
      this.filterResults()
    },

    /**
     * Filters the ARS map based on current query
     * Results are filtered by both ARS code and region name
     */
    filterResults() {
      // Clear results if query is empty
      if (!this.currentQuery) {
        this.searchResults = []
        return
      }

      // Filter and transform results
      const filtered = Object.entries(this.arsMap)
        // Filter entries that match either code or name
        .filter(([ars, name]) => 
          ars.startsWith(this.currentQuery) || 
          name.toLowerCase().includes(this.currentQuery)
        )
        // Transform to ARSEntry objects
        .map(([ars, name]) => ({
          ars,
          name
        }))
        // Sort by ARS code length (shorter codes first)
        .sort((a, b) => a.ars.length - b.ars.length)

      this.searchResults = filtered
    },

    /**
     * Increases the pagination offset to load more results
     */
    loadMore() {
      this.offset += this.pageSize
    }
  },

  getters: {
    /**
     * Returns the current page of results based on offset and page size
     */
    currentPageResults: (state): ARSEntry[] => 
      state.searchResults.slice(state.offset, state.offset + state.pageSize),
    
    /**
     * Checks if there are more results available to load
     */
    hasMoreResults: (state): boolean => 
      state.searchResults.length > (state.offset + state.pageSize),
    
    /**
     * Calculates how many results remain after the current page
     */
    remainingCount: (state): number => 
      Math.max(0, state.searchResults.length - (state.offset + state.pageSize))
  }
})