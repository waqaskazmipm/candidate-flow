export const EXPERIENCE_OPTIONS = [0, 1, 2, 3, 5, 8, 10]

export function normalizeQuery(query) {
  return query.trim().toLowerCase()
}

export function matchesSearch(candidate, normalizedQuery) {
  if (!normalizedQuery) return true
  return [candidate.name, candidate.role, candidate.location].some(
    (field) => typeof field === 'string' && field.toLowerCase().includes(normalizedQuery),
  )
}

export function matchesExperience(candidate, minYears) {
  if (!minYears) return true
  return Number(candidate.years || 0) >= minYears
}