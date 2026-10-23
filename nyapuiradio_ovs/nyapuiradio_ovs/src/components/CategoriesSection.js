import { motion } from "framer-motion";
import { CheckCircle2, LayoutGrid, List } from "lucide-react";
import NomineeCard from "./NomineeCard";

function rankMap(nominees) {
  const sorted = [...nominees].sort((a, b) => (b.votes ?? 0) - (a.votes ?? 0));
  const map = new Map();
  sorted.forEach((nominee, index) => map.set(nominee.id, index + 1));
  return map;
}

export default function CategoriesSection({
  categories,
  layout,
  countsIncluded,
  votedIds,
  canVoteAnywhere,
  onPick,
}) {
  return (
    <section className="section" id="categories">
      <div className="container">
        <motion.div
          className="section-head"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55, ease: "easeOut" }}
        >
          <span className="eyebrow">
            {layout === "grid" ? "The shortlist" : "The ballot"}
          </span>
          <h2 className="section-title">Cast your votes</h2>
          <p className="section-sub">
            One vote per category, and your choice is final. Pick the artists
            and moments that defined the year — every ballot counts.
          </p>
        </motion.div>

        {categories.map((category, index) => {
          const ranks = countsIncluded ? rankMap(category.nominees) : null;
          const votedHere = votedIds.has(category.id);
          const catVoteOpen =
            canVoteAnywhere && category.status === "open" && !votedHere;
          const shareOf = (nominee) =>
            category.totalVotes > 0
              ? ((nominee.votes ?? 0) / category.totalVotes) * 100
              : 0;

          return (
            <motion.article
              key={category.id}
              className="cat-block"
              initial={{ opacity: 0, y: 34 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-70px" }}
              transition={{ type: "spring", stiffness: 80, damping: 17 }}
            >
              <div className="cat-head">
                <span className="cat-index">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="cat-name">{category.name}</h3>
                <div className="cat-chips">
                  {votedHere && (
                    <span className="chip voted">
                      <CheckCircle2 size={12} /> Voted
                    </span>
                  )}
                  <span
                    className={`chip ${category.status === "open" ? "open" : "closed"}`}
                  >
                    {category.status === "open" ? "Open" : "Closed"}
                  </span>
                  {countsIncluded && category.totalVotes != null && (
                    <span className="chip accent">
                      {category.totalVotes.toLocaleString()} votes
                    </span>
                  )}
                  <span className="chip">
                    {layout === "grid" ? (
                      <LayoutGrid size={12} />
                    ) : (
                      <List size={12} />
                    )}
                    {category.nominees.length} nominees
                  </span>
                </div>
              </div>

              {category.description && (
                <p className="cat-desc">{category.description}</p>
              )}

              {category.nominees.length === 0 ? (
                <div className="nom-empty">
                  No nominees have been added to this category yet.
                </div>
              ) : (
                <div className={layout === "grid" ? "nom-grid" : "nom-list"}>
                  {category.nominees.map((nominee) => (
                    <NomineeCard
                      key={nominee.id}
                      nominee={nominee}
                      category={category}
                      rank={ranks ? ranks.get(nominee.id) : null}
                      share={countsIncluded ? shareOf(nominee) : null}
                      countsIncluded={countsIncluded}
                      canVote={catVoteOpen}
                      hasVoted={votedHere}
                      onVote={onPick}
                    />
                  ))}
                </div>
              )}
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}
