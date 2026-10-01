import Icon from './Icon.jsx'

export default function StatCard({ stat }) {
  return (
    <article className="stat" data-tone={stat.tone}>
      <span className="stat__icon">
        <Icon name={stat.icon} size={20} />
      </span>

      <div className="stat__body">
        <p className="stat__label">{stat.label}</p>
        <p className="stat__value">{stat.value}</p>
      </div>

      <p className="stat__trend" data-direction={stat.trend.direction}>
        {stat.trend.direction === 'up' ? <Icon name="trendUp" size={14} /> : null}
        <span>{stat.trend.text}</span>
      </p>
    </article>
  )
}