<template>
  <v-app theme="dark">
    <!-- Single Global Navigation Bar -->
    <v-app-bar v-if="route.path !== '/login'" flat border color="#171b26" class="px-4">
      <div class="d-flex align-center">
        <v-icon icon="mdi-calendar-multiselect" color="primary" size="24" class="mr-2" />
        <span class="text-subtitle-1 font-weight-bold text-white">Full Calendar</span>
      </div>
      <v-spacer />
      <div class="d-flex align-center ga-2">
        <v-btn
          to="/"
          variant="text"
          :color="route.path === '/' ? 'primary' : 'grey-lighten-1'"
          size="small"
          prepend-icon="mdi-view-dashboard"
          class="text-none"
        >
          Dashboard
        </v-btn>
        <v-btn
          to="/calendar"
          variant="text"
          :color="route.path === '/calendar' ? 'primary' : 'grey-lighten-1'"
          size="small"
          prepend-icon="mdi-calendar-month"
          class="text-none"
        >
          Calendar
        </v-btn>
        <v-btn
          variant="text"
          color="error"
          size="small"
          prepend-icon="mdi-logout"
          class="text-none"
          @click="logout"
        >
          Logout
        </v-btn>
      </div>
    </v-app-bar>

    <v-main>
      <NuxtPage />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
const route = useRoute()
const { logout } = useAuth()
</script>