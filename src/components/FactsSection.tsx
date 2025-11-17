import React from "react";
import { motion } from "framer-motion";

// ============================================================================
// EDIT TEXT CONTENT HERE - All facts section text is below
// ============================================================================
const FACTS_DATA = [
  {
    percentage: "320M <br /> Buyer <br /> signals",
    subtext: "Your listing is matched against <br /> millions of real-time buyer signals to <br /> pinpoint what will drive attention <br /> and offers faster.",
  },
  {
    percentage: "150K+ <br /> Hours <br /> trained",
    subtext: "Powered by 150,000+ hours <br /> of listing training, our engine <br /> applies real-world expertise to <br /> every recommendation <br /> for your property",
  },
  {
    percentage: "99.9% <br /> Data <br /> accuracy",
    subtext: "Poor marketing leaves nearly half <br /> of homes stagnating on <br /> the market.",
  },
];
// ============================================================================

// Helper function to render headline with breaks
function renderHeadline(headline: string, percentage: string) {
  if (percentage === "82%") {
    // Break after 3 words, then 2 words (3-2-3 pattern)
    return headline.split(' ').map((word, index, words) => {
      const shouldBreak = (index + 1) === 3 || (index + 1) === 5;
      return (
        <React.Fragment key={index}>
          {word}
          {shouldBreak && index < words.length - 1 && <br />}
          {index < words.length - 1 && !shouldBreak && ' '}
        </React.Fragment>
      );
    });
  } else if (percentage === "48%") {
    // Break after "Sit"
    const parts = headline.split(/(Sit\s+)/i);
    return parts.map((part, index) => (
      <React.Fragment key={index}>
        {part}
        {part.toLowerCase().includes("sit") && index < parts.length - 1 && <br />}
      </React.Fragment>
    ));
  } else if (percentage === "97%") {
    // Break after 3 words, then 3 more words (at positions 3 and 6)
    return headline.split(' ').map((word, index, words) => {
      const shouldBreak = (index + 1) === 3 || (index + 1) === 6;
      return (
        <React.Fragment key={index}>
          {word}
          {shouldBreak && index < words.length - 1 && <br />}
          {index < words.length - 1 && !shouldBreak && ' '}
        </React.Fragment>
      );
    });
  } else if (percentage === "8.4%") {
    // Break after 3 words
    return headline.split(' ').map((word, index, words) => {
      const shouldBreak = (index + 1) === 3;
      return (
        <React.Fragment key={index}>
          {word}
          {shouldBreak && index < words.length - 1 && <br />}
          {index < words.length - 1 && !shouldBreak && ' '}
        </React.Fragment>
      );
    });
  } else {
    // Default: break after every 4 words
    return headline.split(' ').map((word, index, words) => {
      const shouldBreak = (index + 1) % 4 === 0;
      return (
        <React.Fragment key={index}>
          {word}
          {shouldBreak && index < words.length - 1 && <br />}
          {index < words.length - 1 && !shouldBreak && ' '}
        </React.Fragment>
      );
    });
  }
}

// Helper function to render percentage with breaks
function renderPercentage(percentage: string) {
  // Check if percentage contains <br /> tags
  if (percentage.includes('<br />')) {
    return percentage.split('<br />').map((part, index, parts) => (
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
  // Check if subtext contains <br /> tags
  if (subtext.includes('<br />')) {
    return subtext.split('<br />').map((part, index, parts) => (
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
      <div className="max-w-3xl w-full px-6">
        {/* Facts */}
        <div className="space-y-16">
          {facts.map((fact, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="flex justify-center"
            >
              {/* Percentage & Subtext - Centered container, left-aligned text */}
              <div className="flex flex-col items-start gap-2 text-left">
                <span
                  className="text-slate-900"
                  style={{
                    fontSize: "32px",
                    fontWeight: 500,
                    lineHeight: "1",
                    letterSpacing: "-0.02em",
                    fontFamily: "system-ui, -apple-system, sans-serif",
                    textAlign: "left",
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
                    textAlign: "left",
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

