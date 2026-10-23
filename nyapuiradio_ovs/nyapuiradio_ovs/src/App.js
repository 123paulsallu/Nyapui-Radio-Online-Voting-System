import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, MotionConfig } from "framer-motion";
import { AlertTriangle, RotateCw } from "lucide-react";
import { getJSON, postJSON } from "./lib/api";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import CategoriesSection from "./components/CategoriesSection";
import VoteModal from "./components/VoteModal";
import ResultsSection from "./components/ResultsSection";
import Footer from "./components/Footer";

const HEX = /^#[0-9a-f]{6}$/i;

function applyTheme(event) {
  if (HEX.test(event.primaryColor || "")) {
    document.documentElement.style.setProperty("--primary", event.primaryColor);
  }
  if (HEX.test(event.accentColor || "")) {
    document.documentElement.style.setProperty("--accent", event.accentColor);
  }
  if (event.eventName) {
    document.title = event.eventName;
  }
}

export default function App() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [event, setEvent] = useState(null);
  const [standings, setStandings] = useState(null);
  const [ballotIds, setBallotIds] = useState(() => new Set());

  const [voteTarget, setVoteTarget] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [voteError, setVoteError] = useState(null);
  const [voteSuccess, setVoteSuccess] = useState(false);

  const loadRef = useRef(0);

  const load = useCallback(async () => {
    const token = (loadRef.current += 1);
    setLoading(true);
    setError(null);
    try {
      const [nextEvent, nextStandings, ballot] = await Promise.all([
        getJSON("/api/public/event"),
        getJSON("/api/public/standings"),
        getJSON("/api/public/ballot").catch(() => ({ votedCategoryIds: [] })),
      ]);
      if (token !== loadRef.current) return;
      applyTheme(nextEvent);
      setEvent(nextEvent);
      setStandings(nextStandings);
      setBallotIds(new Set(ballot.votedCategoryIds || []));
      setLoading(false);
    } catch (err) {
      if (token !== loadRef.current) return;
      setError(err.message || "Could not reach the voting server.");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const closeVoteModal = useCallback(() => {
    if (submitting) return;
    setVoteTarget(null);
    setVoteError(null);
    setVoteSuccess(false);
  }, [submitting]);

  const submitVote = useCallback(async () => {
    if (!voteTarget || submitting) return;
    const { category, nominee } = voteTarget;
    setSubmitting(true);
    setVoteError(null);
    try {
      const result = await postJSON("/api/vote", {
        categoryId: category.id,
        nomineeId: nominee.id,
      });
      setBallotIds((prev) => {
        const next = new Set(prev);
        (result.votedCategoryIds || [category.id]).forEach((id) =>
          next.add(id),
        );
        return next;
      });
      setVoteSuccess(true);
      if (standings && standings.countsIncluded) {
        getJSON("/api/public/standings").then(setStandings).catch(() => {});
      }
    } catch (err) {
      setVoteError(err.message || "Something went wrong recording your vote.");
      if (err.status === 409) {
        getJSON("/api/public/ballot")
          .then((ballot) =>
            setBallotIds(new Set(ballot.votedCategoryIds || [])),
          )
          .catch(() => {});
        if (standings && standings.countsIncluded) {
          getJSON("/api/public/standings").then(setStandings).catch(() => {});
        }
      }
    } finally {
      setSubmitting(false);
    }
  }, [voteTarget, submitting, standings]);

  const scrollToVoting = useCallback(() => {
    document
      .getElementById("categories")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  if (loading) {
    return (
      <MotionConfig reducedMotion="user">
        <div className="splash">
          <span className="spinner lg" />
          <div>Loading the ballot…</div>
        </div>
      </MotionConfig>
    );
  }

  if (error || !event) {
    return (
      <MotionConfig reducedMotion="user">
        <div className="splash">
          <div className="status-banner warn" role="alert">
            <AlertTriangle size={20} />
            <div>
              <div className="title">Couldn&apos;t load the voting site</div>
              <div className="detail">{error}</div>
            </div>
          </div>
          <button type="button" className="btn btn-primary" onClick={load}>
            <RotateCw size={16} /> Try again
          </button>
        </div>
      </MotionConfig>
    );
  }

  const canVoteAnywhere =
    event.votingActive && event.votingState === "open";

  return (
    <MotionConfig reducedMotion="user">
      <div id="top">
        <Nav event={event} />
        <main>
          <Hero
            event={event}
            summary={standings && standings.summary}
            onScrollToVoting={scrollToVoting}
          />
          <CategoriesSection
            categories={(standings && standings.categories) || []}
            layout={event.categoryLayout === "list" ? "list" : "grid"}
            countsIncluded={Boolean(standings && standings.countsIncluded)}
            votedIds={ballotIds}
            canVoteAnywhere={canVoteAnywhere}
            onPick={(category, nominee) => {
              setVoteError(null);
              setVoteSuccess(false);
              setVoteTarget({ category, nominee });
            }}
          />
          <ResultsSection standings={standings} event={event} />
        </main>
        <Footer event={event} />

        <AnimatePresence>
          {voteTarget && (
            <VoteModal
              target={voteTarget}
              submitting={submitting}
              error={voteError}
              success={voteSuccess}
              onConfirm={submitVote}
              onChange={closeVoteModal}
              onClose={closeVoteModal}
            />
          )}
        </AnimatePresence>
      </div>
    </MotionConfig>
  );
}
