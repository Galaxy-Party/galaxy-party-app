export type RegFields = { username?: string; email?: string; password?: string }

/** Returns a validation error message for a registration field, or undefined if valid. */
export function validateField(field: keyof RegFields, value: string): string | undefined {
  if (field === 'username') {
    if (!value.trim()) return 'Le pseudo est requis'
    if (value.trim().length < 3) return 'Minimum 3 caractères'
    if (value.trim().length > 32) return 'Maximum 32 caractères'
  }
  if (field === 'email') {
    if (!value.trim()) return "L'email est requis"
    if (!value.includes('@')) return 'Adresse email invalide'
  }
  if (field === 'password') {
    if (!value) return 'Le mot de passe est requis'
    if (value.length < 8) return 'Minimum 8 caractères'
  }
  return undefined
}
