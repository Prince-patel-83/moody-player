import { Link } from "react-router-dom";
export default function PageNotFound() {
  return (
    <main className="not-found-page">
      <div className="not-found-art">
        <span>4</span>
        <i className="ri-disc-3-line" />
        <span>4</span>
      </div>
      <span className="section-kicker">OFF THE BEAT</span>
      <h1>Looks like this track skipped.</h1>
      <p>We couldn't find the page you were looking for.</p>
      <Link to="/" className="not-found-home">
        <i className="ri-arrow-left-line" /> Back to home</Link>
    </main>

  )
}
