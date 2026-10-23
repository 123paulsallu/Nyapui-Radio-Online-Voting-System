import { motion } from "framer-motion";
import { Check, Lock, Vote } from "lucide-react";
import { hueFor, initials } from "../lib/format";
import { mediaUrl } from "../lib/api";

function Avatar({ nominee, large = false }) {
  const photo = mediaUrl(nominee.photoUrl);
  const hue = hueFor(nominee.name);
  return (
    <span
      className={`avatar ${large ? "lg" : ""}`}
      style={{
        background: `linear-gradient(135deg, hsl(${hue} 62% 46%), hsl(${
          (hue + 42) % 360
        } 58% 28%))`,
      }}
    >
      {photo ? <img src={photo} alt={nominee.name} /> : initials(nominee.name)}
    </span>
  );
}

export { Avatar };

export default function NomineeCard({
  nominee,
  category,
  rank,
  share,
  countsIncluded,
  canVote,
  hasVoted,
  onVote,
}) {
  const topRank = rank && rank <= 3 ? `r${rank}` : null;

  return (
    <motion.article
      className={`nom-card ${rank === 1 && countsIncluded ? "is-winner" : ""}`}
      layout
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ type: "spring", stiffness: 110, damping: 18 }}
    >
      {topRank && countsIncluded && <span className={`rank ${topRank}`}>{rank}</span>}

      <div className="nom-top">
        <Avatar nominee={nominee} />
        <div style={{ minWidth: 0 }}>
          <div className="nom-name">{nominee.name}</div>
          {nominee.department && <div className="nom-dept">{nominee.department}</div>}
        </div>
      </div>

      {nominee.biography && <p className="nom-bio">{nominee.biography}</p>}

      <div className="nom-actions">
        {countsIncluded && (
          <div className="nom-meter">
            <div className="nom-meter-row">
              <span>
                <b>{(nominee.votes ?? 0).toLocaleString()}</b> votes
              </span>
              <span>{share != null ? `${share.toFixed(1)}%` : "—"}</span>
            </div>
            <div className="meter">
              <motion.i
                initial={{ width: 0 }}
                whileInView={{ width: `${share ?? 0}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1.1, ease: "easeOut", delay: 0.15 }}
              />
            </div>
          </div>
        )}

        {hasVoted ? (
          <span className="voted-flag">
            <Check size={16} />
            Your vote
          </span>
        ) : canVote ? (
          <button
            type="button"
            className="btn btn-primary btn-sm btn-block"
            onClick={() => onVote(category, nominee)}
          >
            <Vote size={16} />
            Vote for {nominee.name.split(" ")[0]}
          </button>
        ) : (
          <button type="button" className="btn btn-ghost btn-sm btn-block" disabled>
            <Lock size={15} />
            Voting unavailable
          </button>
        )}
      </div>
    </motion.article>
  );
}
