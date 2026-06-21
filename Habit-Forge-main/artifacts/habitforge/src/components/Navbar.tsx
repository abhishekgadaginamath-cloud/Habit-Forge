import { useState, useEffect } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import Logo from "./Logo";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 32px",
        height: 60,
        background: scrolled
          ? "rgba(15, 14, 23, 0.85)"
          : "rgba(15, 14, 23, 0.6)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: "0.5px solid",
        borderColor: scrolled ? "rgba(127, 119, 221, 0.25)" : "rgba(42, 40, 64, 0.5)",
        transition: "background 0.25s, border-color 0.25s",
      }}
    >
      <Link href="/">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            cursor: "pointer",
            textDecoration: "none",
          }}
        >
          <div style={{ position: "relative" }}>
            <div
              style={{
                position: "absolute",
                inset: -4,
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(127,119,221,0.3) 0%, transparent 70%)",
                pointerEvents: "none",
              }}
            />
            <Logo size={32} />
          </div>
          <div>
            <div
              style={{
                fontWeight: 800,
                fontSize: 16,
                color: "#e8e6f0",
                letterSpacing: "-0.02em",
                lineHeight: 1,
              }}
            >
              HabitForge
            </div>
            <div
              style={{
                fontSize: 9,
                color: "#7f77dd",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                lineHeight: 1,
                marginTop: 2,
              }}
            >
              RPG Habits
            </div>
          </div>
        </div>
      </Link>

      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <Link href="/sign-in">
          <motion.button
            whileHover={{ scale: 1.03, borderColor: "rgba(127,119,221,0.6)" }}
            whileTap={{ scale: 0.97 }}
            style={{
              background: "transparent",
              border: "0.5px solid rgba(42,40,64,0.9)",
              color: "#afa9ec",
              borderRadius: 8,
              padding: "7px 16px",
              fontSize: 13,
              fontWeight: 500,
              cursor: "pointer",
              transition: "border-color 0.15s, color 0.15s",
            }}
          >
            Sign in
          </motion.button>
        </Link>
        <Link href="/sign-up">
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            style={{
              background: "linear-gradient(135deg, #7f77dd 0%, #5d56b8 100%)",
              border: "none",
              color: "#fff",
              borderRadius: 8,
              padding: "7px 18px",
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: "0 0 16px rgba(127,119,221,0.4)",
              letterSpacing: "-0.01em",
            }}
          >
            Start free
          </motion.button>
        </Link>
      </div>
    </nav>
  );
}
