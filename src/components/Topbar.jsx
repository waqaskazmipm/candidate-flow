import { useEffect, useRef, useState } from 'react'
import Icon from './Icon.jsx'

function detectShortcut() {
  const platform = navigator.userAgentData?.platform ?? navigator.platform ?? ''
  return /mac|iphone|ipad|ipod/i.test(platform) ? '⌘K' : 'Ctrl K'
}

export default function Topbar({ onAddCandidate, searchQuery, onSearchChange, onClearSearch }) {
  const inputRef = useRef(null)
  const hasQuery = searchQuery.length > 0
  const [shortcut] = useState(detectShortcut)

  useEffect(() => {
    function handleShortcut(event) {
      if (!(event.metaKey || event.ctrlKey) || event.key.toLowerCase() !== 'k') return
      event.preventDefault()
      inputRef.current?.focus()
      inputRef.current?.select()
    }

    document.addEventListener('keydown', handleShortcut)
    return () => document.removeEventListener('keydown', handleShortcut)
  }, [])

  return (
    <header className="topbar">
      <div className="topbar__inner">
        <a className="brand" href="#top">
          <span className="brand__mark">
            <Icon name="logo" size={20} />
          </span>
          <span className="brand__text">
            <span className="brand__name">CandidateFlow</span>
            <span className="brand__subtitle">Hiring Pipeline Dashboard</span>
          </span>
        </a>

        <div className="topbar__actions">
          <div className="search">
            <Icon name="search" size={16} className="search__icon" />
            <input
              className="search__input"
              type="search"
              placeholder="Search candidates or roles"
              aria-label="Search candidates by name, role, or location"
              value={searchQuery}
              onChange={(event) => onSearchChange(event.target.value)}
              ref={inputRef}
            />
            {hasQuery ? (
              <button
                className="search__clear"
                type="button"
                onClick={onClearSearch}
                aria-label="Clear search"
              >
                <Icon name="close" size={13} />
              </button>
            ) : (
              <kbd className="search__kbd" aria-hidden="true">
                {shortcut}
              </kbd>
            )}
          </div>

          <button className="btn btn--primary" type="button" onClick={onAddCandidate}>
            <Icon name="plus" size={16} />
            <span className="btn__label">New candidate</span>
          </button>

          <span className="avatar avatar--account" data-tone="indigo">
            ER
          </span>
        </div>
      </div>
    </header>
  )
}