const RECENT_DRAG_MS = 250

const active = { candidateId: null, stageId: null }
let lastDragEnd = 0

export function beginDrag(candidateId, stageId) {
  active.candidateId = candidateId
  active.stageId = stageId
}

export function endDrag() {
  active.candidateId = null
  active.stageId = null
  lastDragEnd = Date.now()
}

export function getDrag() {
  return active
}

export function wasRecentDrag() {
  return Date.now() - lastDragEnd < RECENT_DRAG_MS
}