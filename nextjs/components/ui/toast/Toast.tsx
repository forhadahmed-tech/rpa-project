import { motion, AnimatePresence } from "framer-motion";

const Toast = ({ message, isVisible, onClose }) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.3 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.5 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          style={{
            position: "fixed",
            top: 20,
            right: 20,
            background: "#333",
            color: "white",
            padding: "12px 20px",
            borderRadius: "8px",
            zIndex: 1000,
          }}
          onAnimationComplete={() => {
            // Auto-close after animation
            setTimeout(onClose, 3000);
          }}
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
export default Toast;