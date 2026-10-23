import { useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, ShieldCheck, X } from "lucide-react";
import { Avatar } from "./NomineeCard";

export default function VoteModal({
  target,
  submitting,
  error,
  success,
  onConfirm,
  onChange,
  onClose,
}) {
  useEffect(() => {
    if (!target || submitting) return undefined;
    const onKey = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [target, submitting, onClose]);

  useEffect(() => {
    if (!success) return undefined;
    const timer = setTimeout(onClose, 1900);
    return () => clearTimeout(timer);
  }, [success, onClose]);

  if (!target) return null;
  const { category, nominee } = target;

  return (
    <motion.div
      className="modal-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={submitting ? undefined : onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Confirm your vote"
    >
      <motion.div
        className="modal-card"
        initial={{ opacity: 0, y: 34, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.97 }}
        transition={{ type: "spring", stiffness: 260, damping: 24 }}
        onClick={(event) => event.stopPropagation()}
      >
        {!submitting && !success && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            style={{
              position: "absolute",
              top: 16,
              right: 16,
              background: "var(--glass)",
              border: "1px solid var(--line)",
              borderRadius: 10,
              width: 34,
              height: 34,
              display: "grid",
              placeItems: "center",
              color: "var(--muted)",
              cursor: "pointer",
            }}
          >
            <X size={16} />
          </button>
        )}

        {success ? (
          <div className="modal-success">
            <motion.div
              className="success-ring"
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 240, damping: 14 }}
            >
              <CheckCircle2 size={40} />
            </motion.div>
            <h3 className="modal-title">Vote counted!</h3>
            <p className="muted" style={{ fontSize: 14.5 }}>
              Your vote for <strong style={{ color: "var(--ink)" }}>
                {nominee.name}
              </strong>{" "}
              in {category.name} has been recorded.
            </p>
          </div>
        ) : (
          <>
            <span className="modal-eyebrow">Confirm your vote</span>
            <h3 className="modal-title">{nominee.name}</h3>
            <p className="modal-cat">in {category.name}</p>

            <div className="modal-nom">
              <Avatar nominee={nominee} large />
              <div>
                <div className="nom-name" style={{ fontSize: 18 }}>
                  {nominee.name}
                </div>
                {nominee.department && (
                  <div className="nom-dept">{nominee.department}</div>
                )}
              </div>
            </div>

            <div className="modal-note">
              <ShieldCheck size={17} />
              <span>
                One vote per category and it&apos;s final. Your ballot is
                anonymous — no names, emails or IP addresses are stored against
                it.
              </span>
            </div>

            {error && (
              <div className="modal-error" role="alert">
                {error}
              </div>
            )}

            <div className="modal-actions">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={onChange}
                disabled={submitting}
              >
                Change
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={onConfirm}
                disabled={submitting}
                data-vote-confirm
              >
                {submitting ? (
                  <>
                    <span className="spinner" /> Recording…
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={17} /> Confirm vote
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}
