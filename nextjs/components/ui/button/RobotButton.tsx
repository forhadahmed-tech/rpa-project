import React from "react";
import { motion } from "framer-motion";

export default function RobotButton({
  onClick,
  className = "",
  children = "Proceed for Automation",
}: {
  onClick?: () => void;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
      className={`relative overflow-hidden cursor-pointer flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-cyan-100 border border-cyan-400 rounded-md shadow-md bg-linear-to-r from-cyan-700 to-blue-800 hover:shadow-cyan-400/50 transition-all duration-300 ${className}`}
    >
      {/* Circular rotating icon on the RIGHT side */}
      <motion.div
        className="relative z-10 flex items-center justify-center"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-[0_0_6px_#00ffff]"
        >
          {/* Outer circle */}
          <circle
            cx="12"
            cy="12"
            r="8"
            stroke="#00fff0"
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
          />
          {/* Inner rotating element */}
          <motion.circle
            cx="12"
            cy="12"
            r="4"
            stroke="#bffff6"
            strokeWidth="1.2"
            fill="none"
            strokeDasharray="8 16"
          />
          {/* Center dot */}
          <circle cx="12" cy="12" r="1.5" fill="#00ffc9" />
        </svg>
      </motion.div>
      
      <span className="relative z-10 tracking-wide flex items-center">
        {children}
      </span>

      {/* Animated Glow */}
      <motion.span
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,#00ffff33,transparent_70%)] rounded-md"
        animate={{ opacity: [0.3, 0.7, 0.3] }}
        transition={{ repeat: Infinity, duration: 3 }}
      />

      {/* Pulsing border effect */}
      <motion.span
        className="absolute inset-0 rounded-md border border-cyan-400"
        animate={{
          opacity: [0.2, 1, 0.2],
          boxShadow: ["0 0 4px #00ffff", "0 0 12px #00ffff", "0 0 4px #00ffff"],
        }}
        transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
      />
    </motion.button>
  );
}