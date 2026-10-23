import { motion } from "framer-motion";
import {
  CalendarClock,
  ChevronDown,
  Info,
  PauseCircle,
  Radio,
  Trophy,
} from "lucide-react";
import { formatDate } from "../lib/format";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 26 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 90, damping: 16 },
  },
};

function StatusBanner({ event }) {
  const now = Date.now();
  const opens = event.opensAt ? Date.parse(event.opensAt) : null;
  const closes = event.closesAt ? Date.parse(event.closesAt) : null;

  let tone = "info";
  let Icon = Info;
  let title = null;
  let detail = null;

  if (event.votingState === "paused") {
    tone = "warn";
    Icon = PauseCircle;
    title = "Voting is paused";
    detail =
      "The organisers have temporarily paused voting. You can still browse the nominees below.";
  } else if (event.votingState === "closed") {
    Icon = Info;
    title = "Voting is closed";
    detail = event.resultsVisible
      ? "Final standings are revealed below — thanks for making your voice count."
      : "Voting has ended. Standings stay sealed until the results are released.";
  } else if (opens && now < opens) {
    tone = "warn";
    Icon = CalendarClock;
    title = "Voting hasn't opened yet";
    detail = `Mark your calendar — voting opens ${formatDate(event.opensAt)}.`;
  } else if (closes && now > closes) {
    Icon = Info;
    title = "The voting window has closed";
    detail = event.resultsVisible
      ? "Standings are available below."
      : "Standings will appear once results are released.";
  } else {
    return null;
  }

  return (
    <motion.div
      variants={item}
      className={`status-banner ${tone}`}
      role="status"
    >
      <Icon size={20} />
      <div>
        <div className="title">{title}</div>
        <div className="detail">{detail}</div>
      </div>
    </motion.div>
  );
}

export default function Hero({ event, summary, onScrollToVoting }) {
  const opens = formatDate(event.opensAt);
  const closes = formatDate(event.closesAt);
  const schedule = opens && closes ? `${opens} → ${closes}` : closes || opens;

  return (
    <section className="hero" id="top">
      <span className="hero-orb a" aria-hidden="true" />
      <span className="hero-orb b" aria-hidden="true" />
      <span className="hero-orb c" aria-hidden="true" />

      <div className="container">
        <motion.div
          className="hero-inner"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <motion.div className="hero-kicker" variants={item}>
            <Radio size={15} style={{ color: "var(--accent)" }} />
            <span>
              <strong>OFFICIAL</strong> Online Voting Portal
            </span>
          </motion.div>

          <motion.h1 variants={item}>
            <span className="grad">{event.eventName}</span>
          </motion.h1>

          {event.tagline && (
            <motion.p className="hero-tagline" variants={item}>
              {event.tagline}
            </motion.p>
          )}

          {event.description && (
            <motion.p className="hero-desc" variants={item}>
              {event.description}
            </motion.p>
          )}

          <motion.div className="hero-actions" variants={item}>
            <button
              type="button"
              className="btn btn-primary"
              onClick={onScrollToVoting}
            >
              <Trophy size={18} />
              Start voting
            </button>
            <a className="btn btn-ghost" href="#results">
              See standings
            </a>
          </motion.div>

          <motion.div className="hero-stats" variants={item}>
            <div className="stat-pill">
              <b>{event.stats.categories}</b>
              <span>categories</span>
            </div>
            <div className="stat-pill">
              <b>{event.stats.nominees}</b>
              <span>nominees</span>
            </div>
            {summary && (
              <div className="stat-pill">
                <b>{summary.totalVotes.toLocaleString()}</b>
                <span>votes cast</span>
              </div>
            )}
          </motion.div>

          {schedule && (
            <motion.div className="hero-schedule" variants={item}>
              <CalendarClock size={15} />
              {schedule}
            </motion.div>
          )}

          <StatusBanner event={event} />
        </motion.div>
      </div>

      <a
        className="scroll-cue"
        href="#categories"
        aria-label="Scroll to categories"
      >
        <ChevronDown size={26} />
      </a>
    </section>
  );
}
