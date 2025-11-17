import React from "react";
import { motion } from "framer-motion";

// ============================================================================
// EDIT TEXT CONTENT HERE - All facts section text is below
// ============================================================================
const FACTS_DATA = [
  {
    percentage: "320M <br /> Buyer <br /> signals",
    subtext:
      "Your listing is matched against <br /> millions of real-time buyer signals to <br /> pinpoint what will drive attention <br /> and offers faster.",
  },
  {
    percentage: "150K+ <br /> Hours <br /> trained",
    subtext:
      "Powered by 150,000+ hours <br /> of listing training, our engine <br /> applies real-world expertise to <br /> every recommendation <br /> for your property",
  },
  {
    percentage: "99.9% <br /> Data <br /> accuracy",
    subtext:
      "Poor marketing leaves nearly half <br /> of homes stagnating on <br /> the market.",
  },
];
// ============================================================================

// Helper function to render percentage with breaks
function renderPercentage(percentage: string) {
  if (percentage.includes("<br />")) {
    return percentage.split("<br />").map((part: string, index: number, parts: string[]) => (
      <React.Fragment key={index}>
        {part.trim()}
        {index < parts.length - 1 && <br />}
      </React.Fragment>
    ));
  }
  return percentage;
}

// Helper function to render subtext with breaks
function renderSubtext(subtext: string) {
  if (subtext.includes("<br />")) {
    return subtext.split("<br />").map((part: string, index: number, parts: string[]) => (
      <React.Fragment key={index}>
        {part.trim()}
        {index < parts.length - 1 && <br />}
      </React.Fragment>
    ));
  }
  return subtext;
}

export default function FactsSection() {
  const facts = FACTS_DATA;

  return (
    <div className="w-full py-20 bg-white flex justify-center">
      <div className="max-w-7xl w-full px-6">
        {/* SECTION HEADLINE */}
        <h2
          className="text-slate-900 text-3xl md:text-4xl font-semibold mb-12 text-left md:text-left text-center md:text-left"
          style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
        >
          Real‑Time Data That Powers Your Listing
        </h2>

        {/* FACT GRID */}
        <div
          className="flex flex-col md:flex-row items-center md:items-start justify-center gap-16 md:gap-8"
        >
          {facts.map((fact, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="flex flex-col items-start text-left w-full md:w-1/3"
            >
              {/* Percentage */}
              <span
                className="text-slate-900"
                style={{
                  fontSize: "32px",
                  fontWeight: 500,
                  lineHeight: "1",
                  letterSpacing: "-0.02em",
                  fontFamily: "system-ui, -apple-system, sans-serif",
                }}
              >
                {renderPercentage(fact.percentage)}
              </span>

              {/* Subtext */}
              <p
                className="text-slate-600 mt-2"
                style={{
                  fontSize: "16px",
                  fontWeight: 400,
                  lineHeight: "1.3",
                  fontFamily: "system-ui, -apple-system, sans-serif",
                }}
              >
                {renderSubtext(fact.subtext)}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

