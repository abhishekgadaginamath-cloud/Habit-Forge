import { motion } from "framer-motion";

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
  delay?: number;
  accentColor?: string;
}

export default function FeatureCard({
  icon,
  title,
  description,
  delay = 0,
  accentColor = "#7f77dd",
}: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4, borderColor: "rgba(127,119,221,0.4)" }}
      style={{
        background: "rgba(19, 18, 31, 0.8)",
        border: "0.5px solid rgba(42,40,64,0.9)",
        borderRadius: 14,
        padding: "24px 22px",
        cursor: "default",
        transition: "border-color 0.2s",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 1,
          background: `linear-gradient(90deg, transparent, ${accentColor}33, transparent)`,
        }}
      />
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 10,
          background: `${accentColor}18`,
          border: `0.5px solid ${accentColor}30`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 22,
          marginBottom: 14,
        }}
      >
        {icon}
      </div>
      <div
        style={{
          fontSize: 15,
          fontWeight: 700,
          color: "#e8e6f0",
          marginBottom: 8,
          letterSpacing: "-0.01em",
        }}
      >
        {title}
      </div>
      <div
        style={{
          fontSize: 13,
          color: "#8884a8",
          lineHeight: 1.65,
        }}
      >
        {description}
      </div>
    </motion.div>
  );
}
