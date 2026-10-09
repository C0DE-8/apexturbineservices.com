import '../../index.css'
import '../../App.css'
import './NotFound.css'

function NotFound() {
  return (
    <main className="not-found-page">
      <a className="not-found-logo" href="/" aria-label="Apex Turbine Services home">
        <img src="/apex-logo.png" alt="Apex Turbine Services" />
      </a>
      <div className="not-found-content">
        <span className="not-found-code">404</span>
        <p className="eyebrow">Page not found</p>
        <h1>This page is off the grid.</h1>
        <p className="not-found-copy">The address may be incorrect, or the page may have moved. Head back to Apex Turbine Services to find what you need.</p>
        <a className="button" href="/">Back to home <span aria-hidden="true">→</span></a>
      </div>
      <div className="not-found-footer">Apex Turbine Services <span>·</span> Engineering today. Powering tomorrow.</div>
    </main>
  )
}

export default NotFound
