import { useCallback, useEffect, useRef, useState } from 'react'
import Icon from './Icon.jsx'
import { STAGES } from '../data/pipeline.js'
import { EXPERIENCE_OPTIONS } from '../lib/filters.js'

export default function FilterMenu({
  selectedStages,
  onStagesChange,
  minYears,
  onMinYearsChange,
  onClear,
}) {
  const [isOpen, setOpen] = useState(false)
  const wrapperRef = useRef(null)

  const close = useCallback(() => setOpen(false), [])

  useEffect(() => {
    if (!isOpen) return

    function handlePointerDown(event) {
      if (!wrapperRef.current?.contains(event.target)) close()
    }
    function handleKeyDown(event) {
      if (event.key === 'Escape') close()
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, close])

  function toggleStage(stageId) {
    onStagesChange(
      selectedStages.includes(stageId)
        ? selectedStages.filter((id) => id !== stageId)
        : [...selectedStages, stageId],
    )
  }

  const activeCount =
    selectedStages.length + (minYears > 0 ? 1 : 0)

  return (
    <div className="filter" ref={wrapperRef}>
      <button
        className="btn btn--ghost filter__trigger"
        type="button"
        aria-haspopup="true"
        aria-expanded={isOpen}
        onClick={() => setOpen((open) => !open)}
      >
        <Icon name="filter" size={16} />
        <span className="btn__label">Filter</span>
        {activeCount > 0 ? <span className="filter__badge">{activeCount}</span> : null}
      </button>

      {isOpen ? (
        <div className="filter__panel">
          <div className="filter__section">
            <p className="filter__label" id="filter-stage-label">
              Hiring stage
            </p>
            <div className="filter__chips" role="group" aria-labelledby="filter-stage-label">
              <button
                className="filter__chip"
                type="button"
                data-active={selectedStages.length === 0 ? 'true' : undefined}
                aria-pressed={selectedStages.length === 0}
                onClick={() => onStagesChange([])}
              >
                All
              </button>
              {STAGES.map((stage) => (
                <button
                  key={stage.id}
                  className="filter__chip"
                  type="button"
                  data-active={selectedStages.includes(stage.id) ? 'true' : undefined}
                  aria-pressed={selectedStages.includes(stage.id)}
                  onClick={() => toggleStage(stage.id)}
                >
                  {stage.title}
                </button>
              ))}
            </div>
          </div>

          <div className="filter__section">
            <label className="filter__label" htmlFor="filter-min-years">
              Minimum experience
            </label>
            <span className="select">
              <select
                className="field__control"
                id="filter-min-years"
                value={minYears}
                onChange={(event) => onMinYearsChange(Number(event.target.value))}
              >
                {EXPERIENCE_OPTIONS.map((years) => (
                  <option key={years} value={years}>
                    {years === 0 ? 'Any experience' : `${years}+ years`}
                  </option>
                ))}
              </select>
              <Icon name="chevronDown" size={15} className="select__caret" />
            </span>
          </div>

          <footer className="filter__footer">
            <button
              className="btn btn--danger-quiet"
              type="button"
              disabled={activeCount === 0}
              onClick={onClear}
            >
              Clear filters
            </button>
            <button className="btn btn--primary" type="button" onClick={close}>
              Done
            </button>
          </footer>
        </div>
      ) : null}
    </div>
  )
}