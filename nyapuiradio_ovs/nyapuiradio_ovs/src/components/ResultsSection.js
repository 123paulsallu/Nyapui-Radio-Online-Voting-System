import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Lock, Percent, Trophy, Users } from "lucide-react";
import { Avatar } from "./NomineeCard";

function useCountUp(target, duration = 1200) {
  const [value, setValue] = useState(0);
  const rafRef = useRef(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !Number.isFinite(target)) {
      setValue(target);
      return undefined;
    }
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));
      if (progress < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration]);

  return value;
}

function Stat({ icon, value, suffix = "", label }) {
  const count = useCountUp(value);
  return (
    <motion.div
      className="res-stat"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ type: "spring", stiffness: 110, damping: 17 }}
    >
      <b>
        {count.toLocaleString()}
        {suffix}
      </b>
      <span>
        {icon} {label}
      </span>
    </motion.div>
  );
}

export default function ResultsSection({ standings, event }) {
  if (!standings || !standings.resultsVisible) {
    return (
      <section className="section" id="results">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Standings</span>
            <h2 className="section-title">The results are sealed</h2>
          </div>
          <motion.div
            className="sealed"
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="lock">
              <Lock size={26} />
            </span>
            <div>
              <div className="panel-title">
                Standings stay secret until results are released
              </div>
              <p className="muted" style={{ margin: "6px 0 0", fontSize: 14.5 }}>
                {event.votingState === "open"
                  ? "Voting is still open — keep the momentum going. Live counts appear here the moment the organisers lift the veil."
                  : "Voting has wrapped. The leaderboard will appear here the moment results are released."}
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  const summary = standings.summary;
  const overall = standings.categories
    .flatMap((category) =>
      category.nominees.map((nominee) => ({
        ...nominee,
        categoryName: category.name,
      })),
    )
    .filter((nominee) => (nominee.votes ?? 0) > 0)
    .sort((a, b) => (b.votes ?? 0) - (a.votes ?? 0))
    .slice(0, 6);

  const maxVotes = overall[0]?.votes || 1;

  const winners = standings.categories
    .map((category) => {
      const leader = [...category.nominees].sort(
        (a, b) => (b.votes ?? 0) - (a.votes ?? 0),
      )[0];
      return { category, leader };
    })
    .filter((entry) => entry.leader && (entry.leader.votes ?? 0) > 0);

  return (
    <section className="section" id="results">
      <div className="container">
        <motion.div
          className="section-head"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55, ease: "easeOut" }}
        >
          <span className="eyebrow">Standings</span>
          <h2 className="section-title">Results &amp; reports</h2>
          <p className="section-sub">
            {event.votingState === "open"
              ? "The leaderboard so far — updated live while voting is open."
              : "The final tally across every category."}
          </p>
        </motion.div>

        {summary && (
          <div className="res-stats">
            <Stat
              icon={<Trophy size={14} style={{ verticalAlign: "-2px" }} />}
              value={summary.totalVotes}
              label="votes cast"
            />
            <Stat
              icon={<Percent size={14} style={{ verticalAlign: "-2px" }} />}
              value={summary.turnout}
              suffix="%"
              label="voter turnout"
            />
            <Stat
              icon={<Users size={14} style={{ verticalAlign: "-2px" }} />}
              value={summary.verifiedVoters}
              label="verified voters"
            />
            <Stat
              icon={<Trophy size={14} style={{ verticalAlign: "-2px" }} />}
              value={standings.categories.length}
              label="categories contested"
            />
          </div>
        )}

        <div className="res-grid">
          <div className="panel">
            <div className="panel-title">Top nominees overall</div>
            <p className="panel-sub">Ranked by votes across all categories</p>
            {overall.length === 0 ? (
              <p className="muted" style={{ fontSize: 14 }}>
                No votes have been recorded yet.
              </p>
            ) : (
              overall.map((nominee, index) => (
                <motion.div
                  key={nominee.id}
                  className="top-row"
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    type: "spring",
                    stiffness: 120,
                    damping: 18,
                    delay: index * 0.07,
                  }}
                >
                  <span className={`top-pos p${index + 1}`}>{index + 1}</span>
                  <Avatar nominee={nominee} />
                  <div className="top-info">
                    <div className="top-name">{nominee.name}</div>
                    <div className="top-cat">
                      {nominee.categoryName}
                      {nominee.department ? ` · ${nominee.department}` : ""}
                    </div>
                    <div className="meter top-meter">
                      <motion.i
                        initial={{ width: 0 }}
                        whileInView={{
                          width: `${((nominee.votes ?? 0) / maxVotes) * 100}%`,
                        }}
                        viewport={{ once: true }}
                        transition={{
                          duration: 1.1,
                          ease: "easeOut",
                          delay: 0.2 + index * 0.07,
                        }}
                      />
                    </div>
                  </div>
                  <span className="top-votes">
                    {(nominee.votes ?? 0).toLocaleString()}
                  </span>
                </motion.div>
              ))
            )}
          </div>

          <div className="panel">
            <div className="panel-title">Category leaders</div>
            <p className="panel-sub">Front-runners in every race</p>
            <div className="winners-grid">
              {winners.map(({ category, leader }, index) => (
                <motion.div
                  key={category.id}
                  className="winner-card"
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    type: "spring",
                    stiffness: 120,
                    damping: 17,
                    delay: index * 0.06,
                  }}
                >
                  <Avatar nominee={leader} />
                  <div style={{ minWidth: 0 }}>
                    <div className="winner-cat">{category.name}</div>
                    <div className="winner-name">{leader.name}</div>
                    <div className="winner-votes">
                      {(leader.votes ?? 0).toLocaleString()} votes
                    </div>
                  </div>
                </motion.div>
              ))}
              {winners.length === 0 && (
                <p className="muted" style={{ fontSize: 14 }}>
                  Category leaders will appear as votes come in.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
