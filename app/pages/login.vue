<template>
  <v-container fluid class="fill-height login-page-bg d-flex align-center justify-center pa-4 pa-md-6">
    <!-- Main Floating Card Container -->
    <v-card elevation="12" rounded="xl" class="login-card overflow-hidden w-100" max-width="960">
      <v-row no-gutters class="fill-height">
        
        <!-- LEFT COLUMN: Blue Gradient Abstract Banner -->
        <v-col cols="12" md="6" class="left-banner-col pa-8 pa-md-12 d-flex flex-column justify-center position-relative overflow-hidden">
          <!-- Abstract Blue Bubbles / Orbs -->
          <div class="bubble bubble-1" />
          <div class="bubble bubble-2" />
          <div class="bubble bubble-3" />

          <div class="banner-content position-relative z-index-2">
            <h2 class="text-h3 font-weight-bold text-white mb-2 tracking-tight">WELCOME</h2>
            <p class="text-body-2 text-white opacity-80" style="line-height: 1.6;">
              Manage your schedule, track holiday markers, and keep your life perfectly synchronized in one secure, high-performance web app.
            </p>
          </div>
        </v-col>

        <!-- RIGHT COLUMN: Sign In Form -->
        <v-col cols="12" md="6" class="bg-white pa-8 pa-md-12 d-flex flex-column justify-center">
          <div class="mx-auto w-100" style="max-width: 380px;">
            
            <div class="mb-6">
              <h1 class="text-h4 font-weight-bold text-grey-darken-4 mb-1">Sign in</h1>
              <p class="text-body-2 text-grey-darken-1">
                Access your secure calendar workspace
              </p>
            </div>

            <v-alert
              v-if="errorMessage"
              type="error"
              variant="tonal"
              closable
              density="compact"
              class="mb-4"
              @click:close="errorMessage = ''"
            >
              {{ errorMessage }}
            </v-alert>

            <v-alert
              v-if="!clientId"
              type="warning"
              variant="tonal"
              density="compact"
              class="mb-4"
            >
              <strong>Missing Config:</strong> <code>NUXT_PUBLIC_GOOGLE_CLIENT_ID</code> in <code>.env</code>.
            </v-alert>

            <!-- Simulated Username Field -->
            <v-text-field
              readonly
              placeholder="User Name"
              variant="outlined"
              density="comfortable"
              prepend-inner-icon="mdi-account"
              class="mb-3 custom-input"
              hide-details
            />

            <!-- Simulated Password Field with SHOW toggle -->
            <v-text-field
              readonly
              type="password"
              placeholder="Password"
              variant="outlined"
              density="comfortable"
              prepend-inner-icon="mdi-lock"
              class="mb-2 custom-input"
              hide-details
            >
              <template #append-inner>
                <span class="text-caption font-weight-bold text-primary cursor-pointer">SHOW</span>
              </template>
            </v-text-field>

            <!-- Remember me & Forgot Password -->
            <div class="d-flex justify-space-between align-center mb-6">
              <v-checkbox
                label="Remember me"
                density="compact"
                hide-details
                color="primary"
                class="text-caption text-grey-darken-2"
              />
              <a href="#" class="text-caption font-weight-medium text-primary text-decoration-none" @click.prevent>
                Forgot Password?
              </a>
            </div>

            <!-- Primary Sign In Button -->
            <v-btn
              color="#0d3b66"
              block
              size="large"
              class="font-weight-bold text-white text-none mb-4 elevation-2 rounded-lg"
              @click="errorMessage = 'Please use Google Sign-In below to authenticate.'"
            >
              Sign in
            </v-btn>

            <div class="text-center text-caption text-grey mb-4 font-weight-medium">Or</div>

            <!-- Google OAuth Sign In Button Container -->
            <div class="d-flex flex-column align-center mb-6">
              <div ref="googleButtonRef" class="w-100 d-flex justify-center" />
              <v-progress-circular
                v-if="loadingButton"
                indeterminate
                color="primary"
                size="28"
                class="mt-2"
              />
            </div>

            <!-- Footer Sign Up Link -->
            <div class="text-center text-body-2 text-grey-darken-1">
              Don't have an account? 
              <span class="font-weight-bold text-primary cursor-pointer">Sign Up</span>
            </div>

          </div>
        </v-col>

      </v-row>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ['auth']
})

const config = useRuntimeConfig()
const clientId = computed(() => config.public.googleClientId)
const { loginWithCredential } = useAuth()

const googleButtonRef = ref<HTMLElement | null>(null)
const errorMessage = ref('')
const loadingButton = ref(true)

const handleCredentialResponse = (response: any) => {
  if (!response?.credential) {
    errorMessage.value = 'Google Sign-In was cancelled or returned no credential.'
    return
  }

  const success = loginWithCredential(response.credential)
  if (success) {
    navigateTo('/')
  } else {
    errorMessage.value = 'Failed to verify Google user profile.'
  }
}

const renderGoogleButton = () => {
  errorMessage.value = ''
  loadingButton.value = true

  if (!clientId.value) {
    loadingButton.value = false
    return
  }

  const google = (window as any).google
  if (!google?.accounts?.id) {
    errorMessage.value = 'Google Identity Services could not load.'
    loadingButton.value = false
    return
  }

  try {
    google.accounts.id.initialize({
      client_id: clientId.value,
      callback: handleCredentialResponse,
      cancel_on_tap_outside: true
    })

    if (googleButtonRef.value) {
      googleButtonRef.value.innerHTML = ''
      google.accounts.id.renderButton(googleButtonRef.value, {
        theme: 'outline',
        size: 'large',
        width: 340,
        text: 'signin_with',
        shape: 'rectangular'
      })
    }

    google.accounts.id.prompt(() => {})
  } catch (err: any) {
    errorMessage.value = `Sign-In error: ${err?.message || 'Unknown error'}`
  } finally {
    loadingButton.value = false
  }
}

onMounted(() => {
  setTimeout(() => {
    renderGoogleButton()
  }, 300)
})
</script>

<style scoped>
.login-page-bg {
  background: linear-gradient(135deg, #0d47a1 0%, #1976d2 50%, #42a5f5 100%);
  min-height: 100vh;
}

.login-card {
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.25) !important;
  border-radius: 24px !important;
}

.left-banner-col {
  background: linear-gradient(145deg, #0d47a1 0%, #1565c0 60%, #1e88e5 100%);
  min-height: 480px;
}

/* Abstract Blue Bubbles */
.bubble {
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.3), rgba(13, 71, 161, 0.4));
  box-shadow: inset -10px -10px 20px rgba(0, 0, 0, 0.2);
}

.bubble-1 {
  width: 320px;
  height: 320px;
  top: -80px;
  left: -80px;
}

.bubble-2 {
  width: 220px;
  height: 220px;
  bottom: -40px;
  right: -40px;
}

.bubble-3 {
  width: 140px;
  height: 140px;
  bottom: 120px;
  left: 40px;
  opacity: 0.7;
}

.custom-input :deep(.v-field) {
  border-radius: 8px !important;
}
</style>