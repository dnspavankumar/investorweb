import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Copy, Pencil, Check, Undo2 } from "lucide-react";
import { toast } from "sonner";

interface OutreachModalProps {
  open: boolean;
  onClose: () => void;
  emailText: string;
  investorName: string;
}

const OutreachModal = ({ open, onClose, emailText: initialEmail, investorName }: OutreachModalProps) => {
  const [emailText, setEmailText] = useState(initialEmail);
  const [isEditing, setIsEditing] = useState(false);
  const [history, setHistory] = useState([initialEmail]);

  const handleCopy = () => {
    navigator.clipboard.writeText(emailText);
    toast.success("Email copied to clipboard!");
  };

  const handleEdit = () => {
    if (isEditing) {
      setHistory((prev) => [...prev, emailText]);
      setIsEditing(false);
      toast.success("Email saved!");
    } else {
      setIsEditing(true);
    }
  };

  const handleUndo = () => {
    if (history.length > 1) {
      const prev = [...history];
      prev.pop();
      setHistory(prev);
      setEmailText(prev[prev.length - 1]);
      toast("Undo successful");
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-background/80 backdrop-blur-md flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="glass-card w-full max-w-2xl max-h-[80vh] overflow-auto glow-emerald"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div>
                <p className="text-xs font-display font-semibold text-primary tracking-wide">
                  Outreach Email
                </p>
                <p className="font-display text-lg font-bold text-foreground mt-1">To: {investorName}</p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-secondary rounded-lg transition-colors">
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            {/* Toolbar */}
            <div className="flex gap-2 px-6 py-3 border-b border-border bg-secondary/30">
              <button
                onClick={handleUndo}
                className="inline-flex items-center gap-1.5 text-xs font-body border border-border px-3 py-1.5 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
              >
                <Undo2 className="w-3 h-3" /> Undo
              </button>
              <button
                onClick={handleEdit}
                className={`inline-flex items-center gap-1.5 text-xs font-body border px-3 py-1.5 rounded-lg transition-colors ${
                  isEditing
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border hover:bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                {isEditing ? <Check className="w-3 h-3" /> : <Pencil className="w-3 h-3" />}
                {isEditing ? "Save" : "Edit"}
              </button>
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 text-xs font-body border border-border px-3 py-1.5 rounded-lg hover:bg-accent/10 hover:text-accent hover:border-accent/30 transition-colors text-muted-foreground"
              >
                <Copy className="w-3 h-3" /> Copy
              </button>
            </div>

            {/* Email body */}
            <div className="p-6">
              {isEditing ? (
                <textarea
                  value={emailText}
                  onChange={(e) => setEmailText(e.target.value)}
                  className="w-full font-body text-sm leading-relaxed whitespace-pre-wrap text-foreground bg-secondary/50 border border-primary/30 p-4 rounded-lg min-h-[280px] focus:outline-none focus:ring-1 focus:ring-primary/20 resize-y"
                />
              ) : (
                <pre className="font-body text-sm leading-relaxed whitespace-pre-wrap text-foreground bg-secondary/30 border border-border p-4 rounded-lg">
                  {emailText}
                </pre>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OutreachModal;
