// Collapse.jsx
import { AnimatePresence, motion } from 'framer-motion';

export default function Collapse({ isOpen, children }) {
  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="overflow-hidden">{children}</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
