import { useCallback, useEffect, useMemo, useState } from 'react'
import { STAGES, toneForName } from '../data/pipeline.js'

const STORAGE_KEY = 'candidateflow:pipeline:v1'
const EMPTY_STORE = { added: [], overrides: {}, deleted: [] }
const STAGE_IDS = new Set(STAGES.map((stage) => stage.id))

function sanitisePatch(patch = {}) {
  const clean = {}
  if (typeof patch.name === 'string' && patch.name.trim()) clean.name = patch.name.trim()
  if (typeof patch.role === 'string' && patch.role.trim()) clean.role = patch.role.trim()
  if (typeof patch.location === 'string') clean.location = patch.location.trim()
  if (patch.years !== undefined && Number.isFinite(Number(patch.years))) {
    clean.years = Number(patch.years)
  }
  if (STAGE_IDS.has(patch.stage)) clean.stage = patch.stage
  return clean
}

function normaliseStore(parsed) {
  if (Array.isArray(parsed)) {
    return { ...EMPTY_STORE, added: parsed.filter(isValidCandidate) }
  }
  if (!parsed || typeof parsed !== 'object') return EMPTY_STORE

  const overrides = {}
  if (parsed.overrides && typeof parsed.overrides === 'object') {
    for (const [id, patch] of Object.entries(parsed.overrides)) {
      overrides[id] = sanitisePatch(patch)
    }
  }
  if (parsed.moves && typeof parsed.moves === 'object') {
    for (const [id, stageId] of Object.entries(parsed.moves)) {
      overrides[id] = { ...overrides[id], ...sanitisePatch({ stage: stageId }) }
    }
  }

  return {
    added: Array.isArray(parsed.added) ? parsed.added.filter(isValidCandidate) : [],
    overrides,
    deleted: Array.isArray(parsed.deleted)
      ? parsed.deleted.filter((id) => typeof id === 'string')
      : [],
  }
}

function isValidCandidate(entry) {
  return Boolean(entry && typeof entry.id === 'string' && STAGE_IDS.has(entry.stage))
}

function readStore() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return EMPTY_STORE
    return normaliseStore(JSON.parse(raw))
  } catch {
    return EMPTY_STORE
  }
}

function writeStore(store) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
  } catch {
    // Storage unavailable (private mode, quota, disabled) — keep in-memory only.
  }
}

function buildPatch(form) {
  return sanitisePatch({
    name: form.name,
    role: form.role,
    location: form.location,
    years: form.years,
    stage: form.stage,
  })
}

function collectSeedCandidates(store) {
  const deleted = new Set(store.deleted)
  const collected = []

  for (const stage of STAGES) {
    for (const candidate of stage.candidates) {
      if (deleted.has(candidate.id)) continue
      const patch = sanitisePatch(store.overrides[candidate.id])
      collected.push({ ...candidate, ...patch, stage: patch.stage ?? stage.id })
    }
  }
  return collected
}

function mergeStages(store) {
  const buckets = Object.fromEntries(STAGES.map((stage) => [stage.id, []]))

  for (const candidate of [...store.added, ...collectSeedCandidates(store)]) {
    if (buckets[candidate.stage]) buckets[candidate.stage].push(candidate)
  }

  return STAGES.map((stage) => ({ ...stage, candidates: buckets[stage.id] }))
}

function isUserAdded(store, candidateId) {
  return store.added.some((candidate) => candidate.id === candidateId)
}

export default function usePipeline() {
  const [store, setStore] = useState(readStore)

  const stages = useMemo(() => mergeStages(store), [store])

  const counts = useMemo(() => {
    const byStage = Object.fromEntries(stages.map((s) => [s.id, s.candidates.length]))
    return {
      ...byStage,
      total: stages.reduce((sum, s) => sum + s.candidates.length, 0),
    }
  }, [stages])

  const addCandidate = useCallback((form) => {
    const patch = buildPatch(form)
    const candidate = {
      id: `c-${Date.now().toString(36)}`,
      name: patch.name,
      role: patch.role,
      location: patch.location,
      remote: false,
      years: patch.years ?? 0,
      applied: 'just now',
      source: 'Added manually',
      skills: [],
      tone: toneForName(patch.name),
      stage: patch.stage ?? 'applied',
    }
    setStore((previous) => ({ ...previous, added: [candidate, ...previous.added] }))
    return candidate
  }, [])

  const updateCandidate = useCallback((candidateId, form) => {
    const patch = buildPatch(form)
    setStore((previous) => {
      if (isUserAdded(previous, candidateId)) {
        return {
          ...previous,
          added: previous.added.map((candidate) =>
            candidate.id === candidateId ? { ...candidate, ...patch } : candidate,
          ),
        }
      }
      return {
        ...previous,
        overrides: {
          ...previous.overrides,
          [candidateId]: { ...previous.overrides[candidateId], ...patch },
        },
      }
    })
  }, [])

  const moveCandidate = useCallback((candidateId, stageId) => {
    if (!STAGE_IDS.has(stageId)) return

    setStore((previous) => {
      if (isUserAdded(previous, candidateId)) {
        return {
          ...previous,
          added: previous.added.map((candidate) =>
            candidate.id === candidateId ? { ...candidate, stage: stageId } : candidate,
          ),
        }
      }
      if (previous.overrides[candidateId]?.stage === stageId) return previous
      return {
        ...previous,
        overrides: {
          ...previous.overrides,
          [candidateId]: { ...previous.overrides[candidateId], stage: stageId },
        },
      }
    })
  }, [])

  const deleteCandidate = useCallback((candidateId) => {
    setStore((previous) => {
      if (isUserAdded(previous, candidateId)) {
        return { ...previous, added: previous.added.filter((c) => c.id !== candidateId) }
      }
      if (previous.deleted.includes(candidateId)) return previous
      return { ...previous, deleted: [...previous.deleted, candidateId] }
    })
  }, [])

  useEffect(() => {
    writeStore(store)
  }, [store])

  return { stages, counts, addCandidate, updateCandidate, moveCandidate, deleteCandidate }
}