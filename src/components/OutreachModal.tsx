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
          className="fixed inset-0 z-50 bg-primary/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-card border-2 border-border rounded-lg w-full max-w-2xl max-h-[80vh] overflow-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-border">
              <div>
                <p className="font-mono text-[10px] text-secondary uppercase tracking-[0.3em]">
                  ■ OUTREACH_EMAIL
                </p>
                <p className="font-display text-lg uppercase text-primary mt-1">TO: {investorName}</p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-muted rounded-md transition-colors">
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            {/* Toolbar */}
            <div className="flex gap-2 px-5 py-3 border-b border-border bg-muted/50">
              <button
                onClick={handleUndo}
                className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest border border-border px-3 py-1.5 rounded-sm hover:bg-background transition-colors"
              >
                <Undo2 className="w-3 h-3" /> UNDO
              </button>
              <button
                onClick={handleEdit}
                className={`inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest border px-3 py-1.5 rounded-sm transition-colors ${
                  isEditing
                    ? "border-secondary bg-secondary text-secondary-foreground"
                    : "border-border hover:bg-background"
                }`}
              >
                {isEditing ? <Check className="w-3 h-3" /> : <Pencil className="w-3 h-3" />}
                {isEditing ? "SAVE" : "EDIT"}
              </button>
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest border border-border px-3 py-1.5 rounded-sm hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <Copy className="w-3 h-3" /> COPY
              </button>
            </div>

            {/* Email body */}
            <div className="p-5">
              {isEditing ? (
                <textarea
                  value={emailText}
                  onChange={(e) => setEmailText(e.target.value)}
                  className="w-full font-mono text-xs leading-relaxed whitespace-pre-wrap text-primary bg-background border-2 border-secondary p-4 rounded-md min-h-[280px] focus:outline-none focus:ring-2 focus:ring-secondary resize-y"
                />
              ) : (
                <pre className="font-mono text-xs leading-relaxed whitespace-pre-wrap text-primary bg-muted border border-border p-4 rounded-md">
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
