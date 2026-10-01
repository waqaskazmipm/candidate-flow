import { useEffect, useRef, useState } from 'react'
import Icon from './Icon.jsx'
import { STAGE_OPTIONS } from '../data/pipeline.js'

const EMPTY_FORM = { name: '', role: '', location: '', years: '', stage: 'applied' }

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled])'

export default function CandidateModal({
  mode = 'create',
  candidate = null,
  initialStage = 'applied',
  onClose,
  onSubmit,
  onDelete,
}) {
  const isEdit = mode === 'edit' && Boolean(candidate)

  const [form, setForm] = useState(() => {
    if (isEdit) {
      return {
        name: candidate.name ?? '',
        role: candidate.role ?? '',
        location: candidate.location ?? '',
        years:
          candidate.years === undefined || candidate.years === null ? '' : String(candidate.years),
        stage: candidate.stage ?? 'applied',
      }
    }
    const stage = STAGE_OPTIONS.some((option) => option.value === initialStage)
      ? initialStage
      : EMPTY_FORM.stage
    return { ...EMPTY_FORM, stage }
  })
  const [errors, setErrors] = useState({})
  const [isConfirmingDelete, setConfirmingDelete] = useState(false)
  const dialogRef = useRef(null)

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    dialogRef.current?.querySelector('input')?.focus()

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        onClose()
        return
      }
      if (event.key !== 'Tab') return

      const nodes = dialogRef.current?.querySelectorAll(FOCUSABLE)
      if (!nodes?.length) return

      const first = nodes[0]
      const last = nodes[nodes.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [onClose])

  useEffect(() => {
    // Switching to the delete confirmation unmounts the form, so focus would
    // otherwise drop to <body> and break out of the dialog's focus trap.
    if (isConfirmingDelete) dialogRef.current?.focus()
  }, [isConfirmingDelete])

  function handleChange(event) {
    const { name, value } = event.target
    setForm((previous) => ({ ...previous, [name]: value }))
    setErrors((previous) => (previous[name] ? { ...previous, [name]: undefined } : previous))
  }

  function handleSubmit(event) {
    event.preventDefault()

    const years = String(form.years ?? '').trim()
    const nextErrors = {}
    if (!form.name.trim()) nextErrors.name = 'Candidate name is required.'
    if (!form.role.trim()) nextErrors.role = 'Role is required.'
    if (years && (!Number.isFinite(Number(years)) || Number(years) < 0)) {
      nextErrors.years = 'Enter zero or a positive number.'
    }

    setErrors(nextErrors)

    const firstInvalid = Object.keys(nextErrors)[0]
    if (firstInvalid) {
      dialogRef.current?.querySelector(`[name="${firstInvalid}"]`)?.focus()
      return
    }

    onSubmit(form)
  }

  return (
    <div className="modal-overlay" onMouseDown={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="candidate-modal-title"
        aria-describedby="candidate-modal-description"
        ref={dialogRef}
        tabIndex={-1}
        onMouseDown={(event) => event.stopPropagation()}
      >
        {isConfirmingDelete ? (
          <>
            <div className="modal__confirm">
              <span className="modal__confirm-icon">
                <Icon name="alert" size={20} />
              </span>
              <h2 className="modal__title" id="candidate-modal-title">
                Delete {candidate.name}?
              </h2>
              <p className="modal__confirm-text" id="candidate-modal-description">
                This permanently removes the candidate from the pipeline. This cannot be undone.
              </p>
            </div>
            <footer className="modal__footer">
              <span />
              <div className="modal__footer-actions">
                <button
                  className="btn btn--ghost"
                  type="button"
                  onClick={() => setConfirmingDelete(false)}
                >
                  Keep candidate
                </button>
                <button
                  className="btn btn--danger"
                  type="button"
                  onClick={() => onDelete(candidate.id)}
                >
                  <Icon name="trash" size={16} />
                  Delete candidate
                </button>
              </div>
            </footer>
          </>
        ) : (
          <>
            <header className="modal__header">
              <div>
                <h2 className="modal__title" id="candidate-modal-title">
                  {isEdit ? 'Edit candidate' : 'Add candidate'}
                </h2>
                <p className="modal__subtitle" id="candidate-modal-description">
                  {isEdit
                    ? `Update details for ${candidate.name}.`
                    : 'Create a profile and place it in a pipeline stage.'}
                </p>
              </div>
              <button className="icon-btn" type="button" onClick={onClose} aria-label="Close dialog">
                <Icon name="close" size={17} />
              </button>
            </header>

            <form className="modal__form" onSubmit={handleSubmit} noValidate>
              <div className="form-grid">
                <div className="field">
                  <label className="field__label" htmlFor="candidate-name">
                    Candidate name <span className="field__required">*</span>
                  </label>
                  <input
                    className="field__control"
                    id="candidate-name"
                    name="name"
                    type="text"
                    autoComplete="off"
                    placeholder="e.g. Leila Haddad"
                    value={form.name}
                    onChange={handleChange}
                    aria-invalid={errors.name ? 'true' : undefined}
                    aria-describedby={errors.name ? 'candidate-name-error' : undefined}
                  />
                  {errors.name ? (
                    <p className="field__error" id="candidate-name-error">
                      {errors.name}
                    </p>
                  ) : null}
                </div>

                <div className="field">
                  <label className="field__label" htmlFor="candidate-role">
                    Role <span className="field__required">*</span>
                  </label>
                  <input
                    className="field__control"
                    id="candidate-role"
                    name="role"
                    type="text"
                    autoComplete="off"
                    placeholder="e.g. Frontend Engineer"
                    value={form.role}
                    onChange={handleChange}
                    aria-invalid={errors.role ? 'true' : undefined}
                    aria-describedby={errors.role ? 'candidate-role-error' : undefined}
                  />
                  {errors.role ? (
                    <p className="field__error" id="candidate-role-error">
                      {errors.role}
                    </p>
                  ) : null}
                </div>

                <div className="form-row">
                  <div className="field">
                    <label className="field__label" htmlFor="candidate-location">
                      Location
                    </label>
                    <input
                      className="field__control"
                      id="candidate-location"
                      name="location"
                      type="text"
                      autoComplete="off"
                      placeholder="e.g. Amsterdam, NL"
                      value={form.location}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="field">
                    <label className="field__label" htmlFor="candidate-years">
                      Years of experience
                    </label>
                    <input
                      className="field__control"
                      id="candidate-years"
                      name="years"
                      type="number"
                      min="0"
                      step="1"
                      inputMode="numeric"
                      placeholder="0"
                      value={form.years}
                      onChange={handleChange}
                      aria-invalid={errors.years ? 'true' : undefined}
                      aria-describedby={errors.years ? 'candidate-years-error' : undefined}
                    />
                    {errors.years ? (
                      <p className="field__error" id="candidate-years-error">
                        {errors.years}
                      </p>
                    ) : null}
                  </div>
                </div>

                <div className="field">
                  <label className="field__label" htmlFor="candidate-stage">
                    Hiring stage
                  </label>
                  <span className="select">
                    <select
                      className="field__control"
                      id="candidate-stage"
                      name="stage"
                      value={form.stage}
                      onChange={handleChange}
                    >
                      {STAGE_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <Icon name="chevronDown" size={15} className="select__caret" />
                  </span>
                </div>
              </div>

              <footer className="modal__footer">
                {isEdit ? (
                  <button
                    className="btn btn--danger-quiet"
                    type="button"
                    onClick={() => setConfirmingDelete(true)}
                  >
                    <Icon name="trash" size={16} />
                    Delete
                  </button>
                ) : (
                  <span />
                )}
                <div className="modal__footer-actions">
                  <button className="btn btn--ghost" type="button" onClick={onClose}>
                    Cancel
                  </button>
                  <button className="btn btn--primary" type="submit">
                    <Icon name={isEdit ? 'check' : 'plus'} size={16} />
                    {isEdit ? 'Save changes' : 'Save candidate'}
                  </button>
                </div>
              </footer>
            </form>
          </>
        )}
      </div>
    </div>
  )
}