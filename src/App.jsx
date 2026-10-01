import { useCallback, useMemo, useState } from 'react'
import './App.css'
import Topbar from './components/Topbar.jsx'
import StatCard from './components/StatCard.jsx'
import PipelineColumn from './components/PipelineColumn.jsx'
import CandidateModal from './components/CandidateModal.jsx'
import FilterMenu from './components/FilterMenu.jsx'
import Icon from './components/Icon.jsx'
import usePipeline from './hooks/usePipeline.js'
import { SUMMARY_STATS } from './data/pipeline.js'
import { matchesExperience, matchesSearch, normalizeQuery } from './lib/filters.js'

function App() {
  const { stages, counts, addCandidate, updateCandidate, deleteCandidate, moveCandidate } =
    usePipeline()
  const [addStage, setAddStage] = useState(null)
  const [editing, setEditing] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStages, setSelectedStages] = useState([])
  const [minYears, setMinYears] = useState(0)

  const openAddModal = useCallback(() => setAddStage('applied'), [])
  const openAddForStage = useCallback((stageId) => setAddStage(stageId), [])
  const closeAddModal = useCallback(() => setAddStage(null), [])
  const closeEditModal = useCallback(() => setEditing(null), [])
  const clearSearch = useCallback(() => setSearchQuery(''), [])

  const clearFilters = useCallback(() => {
    setSelectedStages([])
    setMinYears(0)
  }, [])

  const clearEverything = useCallback(() => {
    setSearchQuery('')
    setSelectedStages([])
    setMinYears(0)
  }, [])

  const handleCreate = useCallback(
    (form) => {
      addCandidate(form)
      setAddStage(null)
    },
    [addCandidate],
  )

  const handleUpdate = useCallback(
    (form) => {
      if (editing) updateCandidate(editing.id, form)
      setEditing(null)
    },
    [editing, updateCandidate],
  )

  const handleDelete = useCallback(
    (candidateId) => {
      deleteCandidate(candidateId)
      setEditing(null)
    },
    [deleteCandidate],
  )

  const stats = useMemo(
    () =>
      SUMMARY_STATS.map((stat) => ({
        ...stat,
        value: counts[stat.source],
        trend: typeof stat.trend === 'function' ? stat.trend(counts) : stat.trend,
      })),
    [counts],
  )

  const normalizedQuery = normalizeQuery(searchQuery)

  const visibleStages = useMemo(() => {
    const inSelectedStage = (stage) =>
      selectedStages.length === 0 || selectedStages.includes(stage.id)

    return stages
      .filter(inSelectedStage)
      .map((stage) => ({
        ...stage,
        candidates: stage.candidates.filter(
          (candidate) =>
            matchesSearch(candidate, normalizedQuery) &&
            matchesExperience(candidate, minYears),
        ),
      }))
  }, [stages, normalizedQuery, selectedStages, minYears])

  const isFiltering = normalizedQuery.length > 0 || selectedStages.length > 0 || minYears > 0
  const visibleCount = visibleStages.reduce((sum, stage) => sum + stage.candidates.length, 0)
  const hasNoResults = isFiltering && visibleCount === 0

  return (
    <div className="app" id="top">
      <Topbar
        onAddCandidate={openAddModal}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onClearSearch={clearSearch}
      />

      <main className="dashboard">
        <div className="dashboard__intro">
          <div>
            <h1 className="dashboard__heading">Pipeline overview</h1>
            <p className="dashboard__subheading">
              {counts.total} active candidates across {stages.length} hiring stages.
            </p>
          </div>

          <div className="view-switch" role="group" aria-label="View mode">
            <span className="view-switch__option" data-active="true">
              Board
            </span>
            <span className="view-switch__option">Table</span>
          </div>
        </div>

        <section className="stats" aria-label="Pipeline summary">
          {stats.map((stat) => (
            <StatCard key={stat.id} stat={stat} />
          ))}
        </section>

        <section className="pipeline" aria-label="Candidate pipeline">
          <header className="section-head">
            <div className="section-head__group">
              <h2 className="section-head__title">Pipeline</h2>
              {isFiltering && !hasNoResults ? (
                <span className="results-badge">
                  Showing {visibleCount} of {counts.total}
                  <button className="results-badge__clear" type="button" onClick={clearEverything}>
                    Clear
                  </button>
                </span>
              ) : null}
            </div>

            <FilterMenu
              selectedStages={selectedStages}
              onStagesChange={setSelectedStages}
              minYears={minYears}
              onMinYearsChange={setMinYears}
              onClear={clearFilters}
            />
          </header>

          {hasNoResults ? (
            <div className="empty">
              <span className="empty__icon">
                <Icon name="search" size={22} />
              </span>
              <h3 className="empty__title">No candidates found</h3>
              <p className="empty__text">
                {normalizedQuery ? (
                  <>
                    Nothing matches &ldquo;<strong>{searchQuery.trim()}</strong>&rdquo;
                    {selectedStages.length > 0 || minYears > 0 ? ' with the current filters' : ''}.
                  </>
                ) : (
                  'No candidates match the current filters.'
                )}
              </p>
              <button className="btn btn--ghost" type="button" onClick={clearEverything}>
                Clear search and filters
              </button>
            </div>
          ) : (
            <div className="board">
              {visibleStages.map((stage) => (
                <PipelineColumn
                  key={stage.id}
                  stage={stage}
                  isFiltering={isFiltering}
                  onMoveCandidate={moveCandidate}
                  onOpenCandidate={setEditing}
                  onAddCandidate={openAddForStage}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {addStage !== null ? (
        <CandidateModal
          mode="create"
          initialStage={addStage}
          onClose={closeAddModal}
          onSubmit={handleCreate}
        />
      ) : null}

      {editing ? (
        <CandidateModal
          mode="edit"
          candidate={editing}
          onClose={closeEditModal}
          onSubmit={handleUpdate}
          onDelete={handleDelete}
        />
      ) : null}
    </div>
  )
}

export default App