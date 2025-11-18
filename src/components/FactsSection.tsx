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

function renderWithBreaks(text) {
  if (!text.includes('<br />')) return text;
  return text.split('<br />').map((part, index, parts) => (
    <React.Fragment key={index}>
      {part.trim()}
      {index < parts.length - 1 && <br />}
    </React.Fragment>
  ));
}

export default function FactsSection() {
  const facts = FACTS_DATA;

  return (
    <div className="w-full py-20 bg-white flex justify-center">
      <div className="max-w-6xl w-full px-6">
        {/* Facts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          {facts.map((fact, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="flex justify-center md:justify-start"
            >
              {/* Container centered on mobile, left-aligned on desktop */}
              <div className="flex flex-col items-start text-left mx-auto md:mx-0" style={{ maxWidth: "280px" }}>
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
                <p
                  className="text-slate-600"
                  style={{
                    fontSize: "16px",
                    fontWeight: 400,
                    lineHeight: "1.3",
                    fontFamily: "system-ui, -apple-system, sans-serif",
                  }}
                >
                  {renderSubtext(fact.subtext)}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

