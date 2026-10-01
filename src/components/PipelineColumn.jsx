import { useRef, useState } from 'react'
import Icon from './Icon.jsx'
import CandidateCard from './CandidateCard.jsx'
import { getDrag } from '../lib/dragState.js'

export default function PipelineColumn({
  stage,
  isFiltering,
  onMoveCandidate,
  onOpenCandidate,
  onAddCandidate,
}) {
  const [isDropTarget, setDropTarget] = useState(false)
  const enterDepth = useRef(0)

  function acceptsDrag() {
    const drag = getDrag()
    return drag.candidateId !== null && drag.stageId !== stage.id
  }

  function handleDragEnter(event) {
    if (!acceptsDrag()) return
    event.preventDefault()
    enterDepth.current += 1
    setDropTarget(true)
  }

  function handleDragOver(event) {
    const drag = getDrag()
    if (drag.candidateId === null) return
    event.preventDefault()
    event.dataTransfer.dropEffect = drag.stageId === stage.id ? 'none' : 'move'
  }

  function handleDragLeave() {
    enterDepth.current = Math.max(0, enterDepth.current - 1)
    if (enterDepth.current === 0) setDropTarget(false)
  }

  function handleDrop(event) {
    event.preventDefault()
    enterDepth.current = 0
    setDropTarget(false)

    const drag = getDrag()
    if (drag.candidateId === null || drag.stageId === stage.id) return
    onMoveCandidate(drag.candidateId, stage.id)
  }

  const headingId = `column-${stage.id}`

  return (
    <section
      className="column"
      data-stage={stage.id}
      data-dropping={isDropTarget ? 'true' : undefined}
      aria-labelledby={headingId}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <header className="column__header">
        <div className="column__title">
          <span className="column__dot" aria-hidden="true" />
          <h3 className="column__name" id={headingId}>
            {stage.title}
          </h3>
          <span className="column__count">{stage.candidates.length}</span>
        </div>
      </header>

      <p className="column__description">{stage.description}</p>

      <div className="column__cards">
        {stage.candidates.map((candidate) => (
          <CandidateCard
            key={candidate.id}
            candidate={candidate}
            stageId={stage.id}
            onOpen={onOpenCandidate}
          />
        ))}

        {stage.candidates.length === 0 && isFiltering ? (
          <p className="column__empty">No matches</p>
        ) : null}

        <button
          className="column__add"
          type="button"
          onClick={() => onAddCandidate(stage.id)}
        >
          <Icon name="plus" size={15} />
          Add candidate
        </button>
      </div>
    </section>
  )
}