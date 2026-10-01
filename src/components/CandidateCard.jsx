import { useState } from 'react'
import Icon from './Icon.jsx'
import { beginDrag, endDrag, wasRecentDrag } from '../lib/dragState.js'

function Rating({ value }) {
  const rounded = Math.round(value)
  const stars = [1, 2, 3, 4, 5].map((step) => (
    <li
      key={step}
      className="rating__star"
      data-filled={step <= rounded ? 'true' : 'false'}
      aria-hidden="true"
    >
      <Icon name="star" size={12} />
    </li>
  ))

  return (
    <span className="candidate__rating" aria-label={`Rated ${value.toFixed(1)} out of 5`}>
      <ul className="rating" aria-hidden="true">
        {stars}
      </ul>
      <span className="candidate__rating-value" aria-hidden="true">
        {value.toFixed(1)}
      </span>
    </span>
  )
}

function initialsOf(name) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
}

export default function CandidateCard({ candidate, stageId, onOpen }) {
  const [isDragging, setDragging] = useState(false)

  function handleDragStart(event) {
    beginDrag(candidate.id, stageId)
    event.dataTransfer.setData('text/plain', candidate.id)
    event.dataTransfer.effectAllowed = 'move'
    setDragging(true)
  }

  function handleDragEnd() {
    endDrag()
    setDragging(false)
  }

  function handleOpen() {
    if (wasRecentDrag() || !onOpen) return
    onOpen(candidate)
  }

  function handleKeyDown(event) {
    if (event.key !== 'Enter' && event.key !== ' ') return
    event.preventDefault()
    handleOpen()
  }

  return (
    <article
      className="candidate"
      draggable
      role="button"
      aria-label={`Edit ${candidate.name}, ${candidate.role}`}
      data-dragging={isDragging ? 'true' : undefined}
      onClick={handleOpen}
      onKeyDown={handleKeyDown}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      tabIndex={0}
    >
      <header className="candidate__top">
        <span className="avatar" data-tone={candidate.tone}>
          {initialsOf(candidate.name)}
        </span>
        <div className="candidate__identity">
          <h4 className="candidate__name">{candidate.name}</h4>
          <p className="candidate__role">{candidate.role}</p>
        </div>
      </header>

      {candidate.location ? (
        <p className="candidate__meta">
          <Icon name="pin" size={13} />
          <span>{candidate.location}</span>
          {candidate.remote ? <span className="chip chip--remote">Remote</span> : null}
        </p>
      ) : null}

      {candidate.skills?.length ? (
        <ul className="candidate__skills">
          {candidate.skills.map((skill) => (
            <li key={skill} className="chip">
              {skill}
            </li>
          ))}
        </ul>
      ) : null}

      {candidate.nextStep ? (
        <p className="candidate__next">
          <Icon name="calendar" size={13} />
          <span>{candidate.nextStep}</span>
        </p>
      ) : null}

      <footer className="candidate__footer">
        <span className="candidate__applied">
          <Icon name="clock" size={13} />
          {candidate.applied}
          {candidate.years ? <span className="candidate__years">{candidate.years} yrs exp</span> : null}
        </span>
        {candidate.rating ? <Rating value={candidate.rating} /> : <span className="candidate__source">{candidate.source}</span>}
      </footer>
    </article>
  )
}