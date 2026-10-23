import { useEffect, useState } from "react";
import { LayoutDashboard } from "lucide-react";
import { API_ORIGIN, mediaUrl } from "../lib/api";

export function StateBadge({ votingState, compact = false }) {
  const cls =
    votingState === "open"
      ? "live"
      : votingState === "paused"
        ? "paused"
        : "closed";
  const label =
    votingState === "open"
      ? "Voting live"
      : votingState === "paused"
        ? "Paused"
        : "Closed";
  return (
    <span className={`state-badge ${cls}`}>
      <span className="state-dot" />
      {compact ? label.split(" ")[0] : label}
    </span>
  );
}

export default function Nav({ event }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 18);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const logo = mediaUrl(event.logoUrl);

  return (
    <header className={`nav ${scrolled ? "scrolled" : ""}`}>
      <div className="nav-inner">
        <a className="brand" href="#top">
          <span className="brand-mark">
            {logo ? (
              <img src={logo} alt="" />
            ) : (
              <span style={{ fontWeight: 700, color: "#1e3a8a" }}>N</span>
            )}
          </span>
          <span>
            <span className="brand-name">{event.eventName}</span>
            <br />
            <span className="brand-sub">Vote now</span>
          </span>
        </a>

        <nav className="nav-links">
          <a href="#categories">Categories</a>
          <a href="#results">Standings</a>
        </nav>

        <div className="nav-cta">
          <StateBadge votingState={event.votingState} />
          <a
            className="admin-link"
            href={`${API_ORIGIN}/dashboard`}
            target="_blank"
            rel="noreferrer"
          >
            <LayoutDashboard
              size={13}
              style={{ display: "inline", verticalAlign: "-2px" }}
            />{" "}
            Admin
          </a>
        </div>
      </div>
    </header>
  );
}
