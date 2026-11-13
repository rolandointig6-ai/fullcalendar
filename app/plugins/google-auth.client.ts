export default defineNuxtPlugin(() => {
  return new Promise<void>((resolve) => {
    if (typeof window === 'undefined') return resolve()
    if ((window as any).google?.accounts?.id) return resolve()

    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    script.onload = () => resolve()
    script.onerror = () => {
      console.error('Failed to load Google Identity Services script.')
      resolve()
    }
    document.head.appendChild(script)
  })
})