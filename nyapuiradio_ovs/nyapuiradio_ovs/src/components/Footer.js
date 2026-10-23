import { Heart } from "lucide-react";
import { API_ORIGIN, mediaUrl } from "../lib/api";

export default function Footer({ event }) {
  const logo = mediaUrl(event.logoUrl);

  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <span className="brand-mark">
            {logo ? (
              <img src={logo} alt="" />
            ) : (
              <span style={{ fontWeight: 700, color: "#1e3a8a" }}>N</span>
            )}
          </span>
          <div>
            <div className="brand-name">{event.eventName}</div>
            <p className="muted" style={{ margin: "4px 0 0", fontSize: 13.5 }}>
              {event.tagline || "Independent online voting"}
            </p>
          </div>
        </div>

        <div className="footer-links">
          <a href="#categories">Categories</a>
          <a href="#results">Standings</a>
          <a
            href={`${API_ORIGIN}/dashboard`}
            target="_blank"
            rel="noreferrer"
          >
            Admin
          </a>
        </div>

        <p className="footer-note">
          {event.contactEmail && (
            <>
              Contact{" "}
              <a href={`mailto:${event.contactEmail}`}>{event.contactEmail}</a>
              {" · "}
            </>
          )}
          Ballots are anonymous — one vote per category, no personal data
          stored against a ballot.
        </p>

        <p className="footer-copy">
          <Heart size={13} style={{ color: "var(--accent)", verticalAlign: "-2px" }} />{" "}
          {new Date().getFullYear()} {event.eventName} · Powered by Nyapui Radio
        </p>
      </div>
    </footer>
  );
}
