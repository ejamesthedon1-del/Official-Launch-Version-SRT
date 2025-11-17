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
              {/* Percentage & Headline & Subtext - Left Aligned */}
              <div className="flex flex-col items-start gap-2">
                <div className="flex items-start gap-4">
                  <div className="flex flex-col gap-1">
                    <span
                      className="text-slate-900"
                      style={{
                        fontSize: "32px",
                        fontWeight: 400,
                        lineHeight: "1",
                        letterSpacing: "-0.02em",
                      }}
                    >
                      {fact.percentage}
                    </span>
                    <p
                      className="text-slate-600"
                      style={{
                        fontSize: "18px",
                        fontWeight: 400,
                        lineHeight: "1.3",
                        fontStyle: "italic",
                      }}
                    >
                      {fact.subtext}
                    </p>
                  </div>
                  <p
                    className="text-slate-700 pt-1"
                    style={{
                      fontSize: "18px",
                      fontWeight: 400,
                      lineHeight: "1.3",
                    }}
                  >
                    {fact.headline}
                  </p>
                </div>
                <p
                  className="text-slate-400"
                  style={{
                    fontSize: "14px",
                    fontWeight: 500,
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

