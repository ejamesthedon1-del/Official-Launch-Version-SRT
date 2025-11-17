import React from "react";
import { motion } from "framer-motion";

export default function FactsSection() {
  const facts = [
    {
      percentage: "82%",
      headline: "of Agents Still Aren't Leveraging Social for Leads",
      subtext: "Most agents post — but few turn those posts into real inquiries.",
      source: "New York Times",
    },
    {
      percentage: "97%",
      headline: "of Buyers Search Online First",
      subtext: "Agents without a strong digital presence instantly fall behind.",
      source: "Zillow Research",
    },
    {
      percentage: "48%",
      headline: "of Listings Sit 60+ Days",
      subtext: "Poor marketing leaves nearly half of homes stagnating on the market.",
      source: "Redfin Data",
    },
    {
      percentage: "8.4%",
      headline: "of Agents Use Email Marketing",
      subtext: "One of the highest-ROI channels is still massively underused.",
      source: "HubSpot",
    },
  ];

  return (
    <div className="w-full py-20 bg-white">
      <div className="max-w-5xl mx-auto px-6">
        {/* Facts */}
        <div className="space-y-16">
          {facts.map((fact, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="max-w-4xl mx-auto"
            >
              {/* Percentage & Subtext & Headline - Left Aligned, Vertical Stack */}
              <div className="flex flex-col items-start gap-2">
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
                  {fact.percentage}
                </span>
                <p
                  className="text-slate-700"
                  style={{
                    fontSize: "24px",
                    fontWeight: 400,
                    lineHeight: "1.3",
                    fontFamily: "system-ui, -apple-system, sans-serif",
                  }}
                >
                  {(() => {
                    if (fact.percentage === "82%") {
                      // Break after 3 words, then 2 words (3-2-3 pattern)
                      return fact.headline.split(' ').map((word, index, words) => {
                        const shouldBreak = (index + 1) === 3 || (index + 1) === 5;
                        return (
                          <React.Fragment key={index}>
                            {word}
                            {shouldBreak && index < words.length - 1 && <br />}
                            {index < words.length - 1 && !shouldBreak && ' '}
                          </React.Fragment>
                        );
                      });
                    } else if (fact.percentage === "48%") {
                      // Break after "Sit"
                      const parts = fact.headline.split(/(Sit\s+)/i);
                      return parts.map((part, index) => (
                        <React.Fragment key={index}>
                          {part}
                          {part.toLowerCase().includes("sit") && index < parts.length - 1 && <br />}
                        </React.Fragment>
                      ));
                    } else {
                      // For other facts, use word-based breaks
                      return fact.headline.split(' ').map((word, index, words) => {
                        let shouldBreak = false;
                        if (fact.percentage === "97%") {
                          // Break after 3 words, then 3 more words (at positions 3 and 6)
                          shouldBreak = (index + 1) === 3 || (index + 1) === 6;
                        } else if (fact.percentage === "8.4%") {
                          // Break after 3 words
                          shouldBreak = (index + 1) === 3;
                        } else {
                          // Default: break after every 4 words
                          shouldBreak = (index + 1) % 4 === 0;
                        }
                        return (
                          <React.Fragment key={index}>
                            {word}
                            {shouldBreak && index < words.length - 1 && <br />}
                            {index < words.length - 1 && !shouldBreak && ' '}
                          </React.Fragment>
                        );
                      });
                    }
                  })()}
                </p>
                <p
                  className="text-slate-600"
                  style={{
                    fontSize: "16px",
                    fontWeight: 400,
                    lineHeight: "1.3",
                    fontFamily: "system-ui, -apple-system, sans-serif",
                  }}
                >
                  {(() => {
                    if (fact.percentage === "8.4%") {
                      // Break after "ROI"
                      const parts = fact.subtext.split(/(ROI)/i);
                      return parts.map((part, index) => (
                        <React.Fragment key={index}>
                          {part}
                          {part.toUpperCase().includes("ROI") && index < parts.length - 1 && <br />}
                        </React.Fragment>
                      ));
                    } else if (fact.percentage === "48%") {
                      // Break after "nearly"
                      const parts = fact.subtext.split(/(nearly\s+)/i);
                      return parts.map((part, index) => (
                        <React.Fragment key={index}>
                          {part}
                          {part.toLowerCase().includes("nearly") && index < parts.length - 1 && <br />}
                        </React.Fragment>
                      ));
                    } else if (fact.percentage === "97%") {
                      // Break at "strong" (before "strong")
                      const parts = fact.subtext.split(/(\s+strong\s+)/i);
                      return parts.map((part, index) => (
                        <React.Fragment key={index}>
                          {part.toLowerCase().includes("strong") && index > 0 && <br />}
                          {part}
                        </React.Fragment>
                      ));
                    } else {
                      return fact.subtext;
                    }
                  })()}
                </p>
                <p
                  className="text-slate-400"
                  style={{
                    fontSize: "14px",
                    fontWeight: 500,
                    fontFamily: "system-ui, -apple-system, sans-serif",
                  }}
                >
                  – {fact.source}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

