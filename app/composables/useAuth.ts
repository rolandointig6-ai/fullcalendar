export interface GoogleUser {
  name: string
  email: string
  picture: string
  sub: string
}

export const useAuth = () => {
  const user = useState<GoogleUser | null>('google_auth_user', () => null)
  const initialized = useState<boolean>('google_auth_initialized', () => false)

  const initAuth = () => {
    if (import.meta.client && !initialized.value) {
      const saved = localStorage.getItem('google_user_profile')
      if (saved) {
        try {
          user.value = JSON.parse(saved)
        } catch {
          localStorage.removeItem('google_user_profile')
        }
      }
      initialized.value = true
    }
  }

  const decodeJwtPayload = (token: string): GoogleUser | null => {
    try {
      const parts = token.split('.')
      if (parts.length < 2) return null
      const base64Url = parts[1]
      if (!base64Url) return null

      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      )
      const data = JSON.parse(jsonPayload)
      return {
        name: data.name || 'Google User',
        email: data.email || '',
        picture: data.picture || '',
        sub: data.sub || ''
      }
    } catch (e) {
      console.error('Invalid Google credential token', e)
      return null
    }
  }

  const loginWithCredential = (credential: string): boolean => {
    const profile = decodeJwtPayload(credential)
    if (!profile) return false

    user.value = profile
    if (import.meta.client) {
      localStorage.setItem('google_user_profile', JSON.stringify(profile))
    }
    return true
  }

  const logout = () => {
    user.value = null
    if (import.meta.client) {
      localStorage.removeItem('google_user_profile')
      const google = (window as any).google
      if (google?.accounts?.id) {
        google.accounts.id.disableAutoSelect()
      }
    }
    navigateTo('/login')
  }

  return {
    user,
    initAuth,
    loginWithCredential,
    logout
  }
}