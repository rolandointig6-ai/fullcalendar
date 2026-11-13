<template>
  <v-container fluid class="pa-0 dashboard-bg fill-height align-start">
    <v-container class="py-8 px-4 px-md-10 w-100 mt-4" style="max-width: 1400px;">
      
      <!-- TODAY'S DATE & EVENT NOTIFICATION BANNER -->
      <v-alert
        color="teal-darken-4"
        variant="tonal"
        class="mb-6 rounded-xl border-opacity-50 border px-6 py-4"
        icon="mdi-bell-ring-outline"
      >
        <div class="d-flex flex-column flex-md-row justify-space-between align-start align-md-center ga-3">
          <div>
            <div class="text-subtitle-1 font-weight-bold text-teal-lighten-1 d-flex align-center">
              <v-chip size="x-small" color="teal" class="mr-2 font-weight-bold">TODAY</v-chip>
              {{ formattedCurrentDate }}
            </div>
            <p class="text-body-2 text-grey-lighten-2 mb-0 mt-1">
              Your calendar is active and synchronized for today. Click below to view or add scheduled entries.
            </p>
          </div>
          <v-btn to="/calendar" color="teal" variant="flat" size="small" prepend-icon="mdi-calendar-plus" class="text-none font-weight-bold">
            Open Calendar Manager
          </v-btn>
        </div>
      </v-alert>

      <!-- Welcome Banner Card -->
      <v-card elevation="6" rounded="xl" class="pa-6 pa-md-8 mb-6 bg-surface border-opacity-50 border position-relative overflow-hidden">
        <div class="d-flex flex-column flex-md-row justify-space-between align-start align-md-center ga-4">
          <div class="d-flex align-center ga-4">
            <v-avatar size="64" class="elevation-3 border">
              <v-img :src="user?.picture || 'https://randomuser.me/api/portraits/men/32.jpg'" alt="Avatar" />
            </v-avatar>
            <div>
              <div class="d-flex align-center ga-2 mb-1">
                <v-chip size="x-small" color="primary" variant="flat" prepend-icon="mdi-google">
                  Authenticated via Google OAuth 2.0
                </v-chip>
              </div>
              <h1 class="text-h4 font-weight-bold text-white">
                Welcome back, {{ user?.name || 'User' }}!
              </h1>
              <p class="text-body-2 text-grey-lighten-1 mb-0">
                Your session is secure and active. Manage your interactive calendar, upcoming holidays, and events below.
              </p>
            </div>
          </div>
          <v-btn to="/calendar" color="primary" variant="flat" prepend-icon="mdi-calendar-month" class="text-none font-weight-bold px-6">
            Open Calendar
          </v-btn>
        </div>
      </v-card>

      <!-- Account Details Card -->
      <v-card elevation="4" rounded="xl" class="pa-6 bg-surface border-opacity-50 border">
        <h2 class="text-h6 font-weight-bold text-white mb-2 d-flex align-center">
          <v-icon icon="mdi-card-account-details-outline" color="primary" size="22" class="mr-2" />
          Google Account Credentials
        </h2>
        <p class="text-body-2 text-grey mb-6">Connected profile details retrieved from Google token</p>

        <v-list class="bg-transparent pa-0">
          <v-list-item class="px-0 border-bottom mb-2 pb-2">
            <template #prepend>
              <v-icon icon="mdi-account" color="grey-lighten-1" class="mr-3" />
            </template>
            <v-list-item-title class="text-caption text-grey font-weight-bold">Full Name</v-list-item-title>
            <v-list-item-subtitle class="text-body-1 text-white font-weight-medium">{{ user?.name || 'N/A' }}</v-list-item-subtitle>
          </v-list-item>

          <v-list-item class="px-0 border-bottom mb-2 pb-2">
            <template #prepend>
              <v-icon icon="mdi-email" color="grey-lighten-1" class="mr-3" />
            </template>
            <v-list-item-title class="text-caption text-grey font-weight-bold">Email Address</v-list-item-title>
            <v-list-item-subtitle class="text-body-1 text-white font-weight-medium">{{ user?.email || 'N/A' }}</v-list-item-subtitle>
          </v-list-item>

          <v-list-item class="px-0">
            <template #prepend>
              <v-icon icon="mdi-identifier" color="grey-lighten-1" class="mr-3" />
            </template>
            <v-list-item-title class="text-caption text-grey font-weight-bold">Google Account ID (sub)</v-list-item-title>
            <v-list-item-subtitle class="text-body-1 text-white font-weight-medium">{{ user?.sub || 'N/A' }}</v-list-item-subtitle>
          </v-list-item>
        </v-list>
      </v-card>

    </v-container>
  </v-container>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ['auth']
})

const { user } = useAuth()

const formattedCurrentDate = computed(() => {
  const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
  return new Date().toLocaleDateString('en-US', options)
})
</script>

<style scoped>
.dashboard-bg {
  background: linear-gradient(135deg, #121824 0%, #1a2234 100%);
  min-height: 100vh;
}

.border-bottom {
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}
</style>