export default defineNuxtRouteMiddleware((to) => {
  // Skip check on server-side initial render before localStorage is read
  if (import.meta.server) return

  const { user, initAuth } = useAuth()
  initAuth()

  if (!user.value && to.path !== '/login') {
    return navigateTo('/login')
  }

  if (user.value && to.path === '/login') {
    return navigateTo('/')
  }
})