import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { Sparkles, Video, Mic, Home, TrendingUp, User, Target, Brain, BarChart3 } from "lucide-react";
import videoCallImage from "../assets/video-call-laptop.png";

export function SlidingInfoSection() {
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [leftPadding, setLeftPadding] = useState<string>("1rem");
  const [rightPadding, setRightPadding] = useState<string>("0");

  useEffect(() => {
    const calculatePadding = () => {
      if (headlineRef.current && cardsContainerRef.current && window.innerWidth < 768) {
        // Find the "4" character in the headline
        const range = document.createRange();
        const textNode = headlineRef.current.childNodes[0];
        if (textNode && textNode.textContent) {
          range.setStart(textNode, 0);
          range.setEnd(textNode, 1);
          const rect = range.getBoundingClientRect();
          // Get the scrollable container (parent of cardsContainerRef)
          const scrollContainer = cardsContainerRef.current.parentElement;
          if (scrollContainer) {
            const scrollRect = scrollContainer.getBoundingClientRect();
            // Account for the negative margin (-mx-4 = -1rem = -16px)
            const offset = rect.left - scrollRect.left + 16;
            setLeftPadding(`${Math.max(0, offset)}px`);
            // Add right padding to allow last card to scroll fully into view
            setRightPadding('calc(100vw - 68vw - 1rem)');
          }
        }
      } else {
        setLeftPadding("0");
        setRightPadding("0");
      }
    };

    // Use setTimeout to ensure DOM is fully rendered
    const timeoutId = setTimeout(calculatePadding, 0);
    window.addEventListener("resize", calculatePadding);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", calculatePadding);
    };
  }, []);

  // Scroll first card into view on mobile when section loads
  useEffect(() => {
    if (window.innerWidth < 768 && scrollContainerRef.current && leftPadding !== "1rem") {
      const scrollContainer = scrollContainerRef.current;
      // Scroll to show the first card fully - scroll to the left padding position
      const scrollToFirstCard = () => {
        if (scrollContainer) {
          // Parse the left padding value (remove 'px' and convert to number)
          const paddingValue = parseFloat(leftPadding.replace('px', ''));
          if (!isNaN(paddingValue)) {
            // Scroll to position the first card center in viewport
            // Account for negative margin (-16px) and center the card
            const cardWidth = window.innerWidth * 0.68; // 68vw
            const scrollPosition = paddingValue - 16 + (cardWidth / 2) - (window.innerWidth / 2);
            scrollContainer.scrollTo({ left: Math.max(0, scrollPosition), behavior: 'auto' });
          }
        }
      };
      // Delay to ensure layout is complete
      const timeoutId = setTimeout(scrollToFirstCard, 200);
      return () => clearTimeout(timeoutId);
    }
  }, [leftPadding]);

  return (
    <section className="w-full py-20 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 px-4">
          <h2 ref={headlineRef} className="text-4xl md:text-5xl lg:text-6xl text-slate-950 font-medium mb-4">
          4 ways we help your
            <br />
          listings sell faster
          </h2>
        </div>

        {/* Scrollable Cards */}
        <div className="relative mt-2">
          <div ref={scrollContainerRef} className="overflow-x-auto scrollbar-hide snap-x snap-mandatory -mx-4 md:mx-0" id="cards-scroll-container">
            <div ref={cardsContainerRef} className="flex gap-6 pb-4 md:pl-0" style={{ paddingLeft: leftPadding, paddingRight: rightPadding }}>
              {/* Card 1: Blue Card Bottom Text */}
              <div className="flex-shrink-0 w-[68vw] md:w-[320px] snap-center">
                <BlueCardBottomText
                  title="Accelerate Your Listings With Intelligent Data"
                />
              </div>

              {/* Card 2: Light Card With Animation */}
              <div className="flex-shrink-0 w-[68vw] md:w-[320px] snap-center">
                <LightCardWithAnimation
                  title="Help clients move confidently with real-time market intelligence."
                  description="Provide your clients with up-to-the-minute insights that help them make informed decisions faster."
                />
              </div>

              {/* Card 3: Light Card With Buyer Matching */}
              <div className="flex-shrink-0 w-[68vw] md:w-[320px] snap-center">
                <LightCardWithBuyerMatching
                  title="Reach Buyers That Actually Matter"
                  description="Save time and effort by understanding which audience aligns with your property."
                />
              </div>

              {/* Card 4: Blue Card With Progress Animation */}
              <div className="flex-shrink-0 w-[68vw] md:w-[320px] snap-center">
                <BlueCardWithProgressAnimation
                  title="The Fastest Path from Listing to Closing"
                  description="From analysis to match to marketing to close — your AI-powered workflow accelerates every step."
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .snap-x {
          scroll-snap-type: x mandatory;
        }
        .snap-start {
          scroll-snap-align: start;
        }
        .snap-center {
          scroll-snap-align: center;
        }
      `}</style>
    </section>
  );
}

// Blue gradient card with text at bottom (for card 1)
function BlueCardBottomText({ title }: { title: string }) {
  return (
    <motion.div
      className="relative overflow-hidden rounded-3xl p-8 flex flex-col justify-end h-full min-h-[420px]"
      style={{
        background: "linear-gradient(135deg, #2D7FFF 0%, #609BFF 100%)",
      }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {/* Analyzing Listing Animation spanning card */}
      <AnalyzingListingAnimation />

      {/* Overlay that fades browser into card background */}
      <div
        className="absolute inset-x-0 top-0 pointer-events-none z-10"
        style={{
          height: "280px",
          background:
            "linear-gradient(to bottom, rgba(61, 133, 255, 0), rgba(61, 133, 255, 0.05) 30%, rgba(61, 133, 255, 0.15) 55%, rgba(61, 133, 255, 0.35) 75%, rgba(61, 133, 255, 0.65) 90%, #3D85FF 100%)",
        }}
      />

      {/* Glass-like blur/fade at bottom */}
      <div
        className="absolute inset-x-0 bottom-0 h-40 pointer-events-none z-20"
        style={{
          background:
            "linear-gradient(to top, rgba(255, 255, 255, 0.1), transparent)",
          backdropFilter: "blur(8px)",
        }}
      />

      {/* Content at bottom */}
      <div className="relative z-30 space-y-3">
        <h3
          className="text-white text-lg font-medium leading-tight"
          style={{
            fontSize: "18px",
            lineHeight: "140%",
          }}
        >
          {title}
        </h3>
        <p
          className="text-white text-sm leading-relaxed opacity-90"
          style={{
            fontSize: "14px",
            lineHeight: "150%",
          }}
        >
          Smart Realtor Tools turns real-time market intelligence into actionable insights, helping you close smarter and faster.
        </p>
      </div>
    </motion.div>
  );
}

// Analyzing Listing Animation Component
function AnalyzingListingAnimation() {
  const [progress, setProgress] = useState(0);
  const [activeIcon, setActiveIcon] = useState(0);
  const analysisIcons = [
    { icon: Brain, label: "AI Processing", delay: 0.8 },
    { icon: Home, label: "Property Value", delay: 1.6 },
    { icon: BarChart3, label: "Market Data", delay: 2.4 },
    { icon: TrendingUp, label: "Local Trends", delay: 3.2 },
  ];

  useEffect(() => {
    // Progress bar animation
    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100;
        return prev + 2;
      });
    }, 60);

    // Icon activation sequence
    const iconTimers = analysisIcons.map((_, index) => {
      return setTimeout(() => {
        setActiveIcon(index + 1);
      }, analysisIcons[index].delay * 1000);
    });

    return () => {
      clearInterval(progressTimer);
      iconTimers.forEach(clearTimeout);
    };
  }, []);

  return (
    <motion.div
      className="absolute top-0 left-0 right-0 z-0"
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        duration: 0.6,
        ease: "easeOut",
        delay: 0.2,
      }}
      style={{
        height: "260px",
        padding: "20px",
      }}
    >
      {/* Dashboard Container - Positioned to left corner, partially off-screen */}
      <div
        className="absolute h-full rounded-3xl overflow-hidden"
        style={{
          left: "-120px",
          top: "-40px",
          width: "400px",
          background: "rgba(255, 255, 255, 0.95)",
          border: "1px solid rgba(255, 255, 255, 0.3)",
          boxShadow:
            "0 20px 40px rgba(0, 0, 0, 0.12), inset 0 1px 2px rgba(255, 255, 255, 0.8)",
        }}
      >
        {/* Subtle shimmer effect moving across */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(45, 127, 255, 0.08), transparent)",
          }}
          animate={{
            x: ["-100%", "200%"],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear",
            repeatDelay: 1,
          }}
        />

        {/* Content - Adjusted for left-side placement */}
        <div className="p-5 space-y-3.5" style={{ paddingLeft: "100px" }}>
          {/* Status Text with Circular Indicator */}
          <div className="flex items-center gap-3">
            {/* Circular AI Indicator */}
            <motion.div
              className="relative flex items-center justify-center"
              style={{
                width: "32px",
                height: "32px",
              }}
            >
              {/* Outer rotating ring */}
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{
                  border: "2px solid transparent",
                  borderTopColor: "#2D7FFF",
                  borderRightColor: "#609BFF",
                }}
                animate={{
                  rotate: 360,
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
              {/* Inner pulsing core */}
              <motion.div
                className="w-3 h-3 rounded-full"
                style={{
                  background: "linear-gradient(135deg, #2D7FFF, #609BFF)",
                  boxShadow: "0 0 12px rgba(45, 127, 255, 0.4)",
                }}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.8, 1, 0.8],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </motion.div>
            {/* Status Text */}
            <div>
              <div
                style={{
                  fontFamily: "Inter, system-ui, sans-serif",
                  fontSize: "11px",
                  fontWeight: 600,
                  color: "#1B1F23",
                }}
              >
                Analyzing listing
                <motion.span
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  ...
                </motion.span>
              </div>
              <div
                style={{
                  fontFamily: "Inter, system-ui, sans-serif",
                  fontSize: "9px",
                  fontWeight: 500,
                  color: "#6B7280",
                  marginTop: "2px",
                }}
              >
                Market insights
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div
              className="w-full h-1 rounded-full overflow-hidden"
              style={{ background: "rgba(45, 127, 255, 0.1)" }}
            >
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: "linear-gradient(90deg, #2D7FFF, #609BFF)",
                  boxShadow: "0 0 8px rgba(45, 127, 255, 0.3)",
                }}
                animate={{
                  width: `${progress}%`,
                }}
                transition={{
                  duration: 0.3,
                  ease: "easeOut",
                }}
              />
            </div>
          </div>

          {/* Analysis Icons Grid */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            {analysisIcons.map((item, index) => {
              const IconComponent = item.icon;
              const isActive = activeIcon > index;
              
              return (
                <motion.div
                  key={index}
                  className="flex flex-col items-center gap-1.5"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{
                    opacity: isActive ? 1 : 0.3,
                    y: 0,
                  }}
                  transition={{
                    delay: item.delay,
                    duration: 0.5,
                    ease: "easeOut",
                  }}
                >
                  {/* Icon Container */}
                  <motion.div
                    className="relative flex items-center justify-center rounded-xl p-2"
                    style={{
                      background: isActive
                        ? "linear-gradient(135deg, #2D7FFF, #609BFF)"
                        : "rgba(200, 200, 200, 0.15)",
                      border: isActive
                        ? "1px solid rgba(45, 127, 255, 0.3)"
                        : "1px solid rgba(200, 200, 200, 0.2)",
                      boxShadow: isActive
                        ? "0 4px 12px rgba(45, 127, 255, 0.2)"
                        : "none",
                    }}
                    animate={
                      isActive
                        ? {
                            scale: [1, 1.05, 1],
                          }
                        : {}
                    }
                    transition={{
                      delay: item.delay,
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <IconComponent
                      className="w-3.5 h-3.5"
                      style={{
                        color: isActive ? "#FFFFFF" : "#9CA3AF",
                        strokeWidth: 2,
                      }}
                    />
                    {/* Soft glow when active */}
                    {isActive && (
                      <motion.div
                        className="absolute inset-0 rounded-xl"
                        style={{
                          background:
                            "radial-gradient(circle, rgba(45, 127, 255, 0.3), transparent 70%)",
                        }}
                        animate={{
                          opacity: [0.3, 0.6, 0.3],
                          scale: [1, 1.15, 1],
                        }}
                        transition={{
                          delay: item.delay,
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      />
                    )}
                  </motion.div>
                  {/* Icon Label */}
                  <div
                    style={{
                      fontFamily: "Inter, system-ui, sans-serif",
                      fontSize: "8px",
                      fontWeight: isActive ? 600 : 500,
                      color: isActive ? "#2D7FFF" : "#9CA3AF",
                      textAlign: "center",
                      lineHeight: "1.2",
                    }}
                  >
                    {item.label}
                    </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Ambient glow effect */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at 50% 60%, rgba(45, 127, 255, 0.04), transparent 70%)",
          }}
          animate={{
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>
    </motion.div>
  );
}

// Light card with progress animation (Card 4)
function BlueCardWithProgressAnimation({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <motion.div
      className="relative overflow-hidden rounded-3xl p-8 h-full min-h-[420px]"
      style={{
        backgroundColor: "#F7F9FC",
        border: "1px solid rgba(0, 0, 0, 0.08)",
      }}
      whileHover={{
        y: -4,
      }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {/* Progress Flow Animation */}
      <ProgressFlowAnimation />

      {/* Overlay that fades animation into card background */}
      <div
        className="absolute inset-x-0 top-0 pointer-events-none z-10"
        style={{
          height: "340px",
          background:
            "linear-gradient(to bottom, rgba(247, 249, 252, 0), rgba(247, 249, 252, 0.05) 20%, rgba(247, 249, 252, 0.15) 35%, rgba(247, 249, 252, 0.35) 50%, rgba(247, 249, 252, 0.55) 65%, rgba(247, 249, 252, 0.75) 80%, rgba(247, 249, 252, 0.92) 92%, #F7F9FC 100%)",
        }}
      />

      {/* Content */}
      <div className="relative z-20 flex flex-col justify-end" style={{ minHeight: "360px" }}>
        <div className="space-y-3">
          <h3
            className="text-slate-900 text-lg font-medium leading-tight"
            style={{
              fontSize: "18px",
              lineHeight: "140%",
            }}
          >
            {title}
          </h3>
          <p
            className="text-slate-600 text-sm leading-tight"
            style={{
              fontSize: "14px",
              lineHeight: "140%",
            }}
          >
            {description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

// Realistic Dashboard Component (Card 4)
function ProgressFlowAnimation() {
  return (
              <motion.div
      className="absolute top-0 left-0 right-0 z-0"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        ease: "easeOut",
        delay: 0.2,
      }}
      style={{
        height: "260px",
        padding: "20px",
      }}
    >
      <div
        className="relative w-full h-full rounded-2xl overflow-hidden"
        style={{
          background: "rgba(255, 255, 255, 0.98)",
          border: "1px solid rgba(0, 0, 0, 0.08)",
          boxShadow:
            "0 20px 40px rgba(0, 0, 0, 0.08), inset 0 1px 2px rgba(255, 255, 255, 0.9)",
        }}
      >
        {/* Dashboard Content */}
        <div className="p-5 space-y-4">
          {/* Active Listings Stats */}
          <div className="flex items-center justify-between">
            <div>
              <div
                style={{
                  fontFamily: "Inter, system-ui, sans-serif",
                  fontSize: "10px",
                  fontWeight: 500,
                  color: "#6B7280",
                  marginBottom: "4px",
                }}
              >
                Active Pipeline
              </div>
              <div
                style={{
                  fontFamily: "Inter, system-ui, sans-serif",
                  fontSize: "20px",
                  fontWeight: 700,
                  color: "#1B1F23",
                  letterSpacing: "-0.02em",
                }}
              >
                12 Properties
              </div>
            </div>
            <div
              className="px-3 py-1.5 rounded-lg"
              style={{
                background: "rgba(34, 197, 94, 0.08)",
                border: "1px solid rgba(34, 197, 94, 0.15)",
              }}
            >
              <div
                style={{
                  fontFamily: "Inter, system-ui, sans-serif",
                  fontSize: "11px",
                  fontWeight: 600,
                  color: "#059669",
                }}
              >
                +23% this month
              </div>
            </div>
          </div>

          {/* Property Cards Grid */}
          <div className="space-y-2">
            {/* Property 1 */}
            <div
              className="flex items-center justify-between p-3 rounded-lg"
              style={{
                background: "#F9FAFB",
                border: "1px solid #E5E7EB",
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-md"
                  style={{
                    background: "linear-gradient(135deg, #2D7FFF, #609BFF)",
                  }}
                />
                <div>
                  <div
                    style={{
                      fontFamily: "Inter, system-ui, sans-serif",
                      fontSize: "11px",
                      fontWeight: 600,
                      color: "#1B1F23",
                    }}
                  >
                    432 Oak Street
                  </div>
                  <div
                    style={{
                      fontFamily: "Inter, system-ui, sans-serif",
                      fontSize: "9px",
                      fontWeight: 500,
                      color: "#6B7280",
                      marginTop: "2px",
                    }}
                  >
                    3 showings scheduled
                  </div>
                </div>
              </div>
              <div
                className="px-2 py-1 rounded"
                style={{
                  background: "#DBEAFE",
                  fontSize: "9px",
                  fontWeight: 600,
                  color: "#1E40AF",
                }}
              >
                Active
              </div>
            </div>

            {/* Property 2 */}
            <div
              className="flex items-center justify-between p-3 rounded-lg"
              style={{
                background: "#F9FAFB",
                border: "1px solid #E5E7EB",
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-md"
                  style={{
                    background: "linear-gradient(135deg, #10B981, #34D399)",
                  }}
                />
                <div>
                  <div
                    style={{
                      fontFamily: "Inter, system-ui, sans-serif",
                      fontSize: "11px",
                      fontWeight: 600,
                      color: "#1B1F23",
                    }}
                  >
                    789 Maple Ave
                  </div>
                  <div
                    style={{
                      fontFamily: "Inter, system-ui, sans-serif",
                      fontSize: "9px",
                      fontWeight: 500,
                      color: "#6B7280",
                      marginTop: "2px",
                    }}
                  >
                    Offer pending review
                  </div>
                </div>
              </div>
              <div
                className="px-2 py-1 rounded"
                style={{
                  background: "#D1FAE5",
                  fontSize: "9px",
                  fontWeight: 600,
                  color: "#065F46",
                }}
              >
                Closing
                          </div>
                        </div>

            {/* Property 3 */}
            <div
              className="flex items-center justify-between p-3 rounded-lg"
              style={{
                background: "#F9FAFB",
                border: "1px solid #E5E7EB",
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-md"
                  style={{
                    background: "linear-gradient(135deg, #F59E0B, #FBBF24)",
                  }}
                />
                <div>
                  <div
                    style={{
                      fontFamily: "Inter, system-ui, sans-serif",
                      fontSize: "11px",
                      fontWeight: 600,
                      color: "#1B1F23",
                    }}
                  >
                    156 Pine Road
                  </div>
                  <div
                    style={{
                      fontFamily: "Inter, system-ui, sans-serif",
                      fontSize: "9px",
                      fontWeight: 500,
                      color: "#6B7280",
                      marginTop: "2px",
                    }}
                  >
                    2 interested buyers
                  </div>
                </div>
              </div>
              <div
                className="px-2 py-1 rounded"
                style={{
                  background: "#FEF3C7",
                  fontSize: "9px",
                  fontWeight: 600,
                  color: "#92400E",
                }}
              >
                Matching
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Light card with video call animation (Card 2)
function LightCardWithAnimation({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <motion.div
      className="relative overflow-hidden rounded-3xl p-8 h-full min-h-[420px]"
      style={{
        backgroundColor: "#F7F9FC",
        border: "1px solid rgba(0, 0, 0, 0.08)",
      }}
      whileHover={{
        y: -4,
      }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {/* Video call animation */}
      <VideoCallAnimation />

      {/* Overlay that fades video into card background */}
      <div
        className="absolute top-0 right-0 pointer-events-none z-10"
        style={{
          width: "240px",
          height: "180px",
          background:
            "radial-gradient(circle at top right, rgba(247, 249, 252, 0.3) 0%, rgba(247, 249, 252, 0.6) 40%, rgba(247, 249, 252, 0.85) 70%, #F7F9FC 100%)",
        }}
      />

      {/* Content */}
      <div className="relative z-20 flex flex-col justify-end" style={{ minHeight: "360px" }}>
        <div className="space-y-3">
          <h3
            className="text-slate-900 text-lg font-medium leading-tight"
            style={{
              fontSize: "18px",
              lineHeight: "140%",
            }}
          >
            {title}
                          </h3>
          <p
            className="text-slate-600 text-sm leading-tight"
            style={{
              fontSize: "14px",
              lineHeight: "140%",
            }}
          >
            {description}
                          </p>
                        </div>
      </div>
    </motion.div>
  );
}

// Video Call Animation Component
function VideoCallAnimation() {
  const [isMuted, setIsMuted] = useState(false);
  const [showIndicator, setShowIndicator] = useState(false);

  useEffect(() => {
    // Mute indicator animation
    const muteTimer = setTimeout(() => {
      setIsMuted(true);
      setShowIndicator(true);
      // Hide indicator after a moment
      setTimeout(() => {
        setShowIndicator(false);
      }, 2000);
    }, 2000);

    return () => clearTimeout(muteTimer);
  }, []);

  return (
    <motion.div
      className="absolute top-0 right-0 z-0"
      initial={{ opacity: 0, scale: 0.8, x: 20, y: -20 }}
      animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
      transition={{
        duration: 0.5,
        ease: "easeOut",
        delay: 0.2,
      }}
      style={{
        width: "240px",
        height: "180px",
      }}
    >
      {/* Video Call Window */}
      <div
        className="relative w-full h-full rounded-2xl overflow-hidden"
        style={{
          background: "rgba(255, 255, 255, 0.98)",
          border: "1px solid rgba(0, 0, 0, 0.08)",
          boxShadow:
            "0 20px 40px rgba(0, 0, 0, 0.08), inset 0 1px 2px rgba(255, 255, 255, 0.9)",
        }}
      >
        {/* Video Content */}
        <div className="relative w-full h-full">
          <img
            src={videoCallImage}
            alt="Video call interface"
            className="w-full h-full object-cover"
            style={{
              objectPosition: "center",
              width: "100%",
              height: "100%",
            }}
          />
          </div>

        {/* Mute Indicator */}
              <motion.div
          className="absolute bottom-20 right-5 flex items-center gap-2 px-3 py-2 rounded-lg"
          style={{
            background: "rgba(0, 0, 0, 0.75)",
            backdropFilter: "blur(8px)",
          }}
          initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{
            opacity: showIndicator ? 1 : 0,
            scale: showIndicator ? 1 : 0.9,
            y: showIndicator ? 0 : 10,
          }}
          transition={{ duration: 0.3 }}
        >
          <Mic
            className="w-3.5 h-3.5"
            style={{
              color: "#FFFFFF",
            }}
          />
          <div
            style={{
              fontFamily: "Inter, system-ui, sans-serif",
              fontSize: "10px",
              fontWeight: 600,
              color: "#FFFFFF",
            }}
          >
            {isMuted ? "Muted" : "Unmuted"}
          </div>
        </motion.div>

        {/* Control Bar at bottom */}
        <div
          className="absolute bottom-0 left-0 right-0 px-5 py-4"
          style={{
            background:
              "linear-gradient(to top, rgba(0, 0, 0, 0.4), transparent)",
            backdropFilter: "blur(4px)",
          }}
        >
          <div className="flex items-center justify-center gap-3">
            {/* Mic Button */}
            <motion.button
              className="flex items-center justify-center p-2.5 rounded-full"
              style={{
                background: isMuted
                  ? "rgba(239, 68, 68, 0.9)"
                  : "rgba(255, 255, 255, 0.2)",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                cursor: "pointer",
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setIsMuted(!isMuted);
                setShowIndicator(true);
                setTimeout(() => setShowIndicator(false), 2000);
              }}
            >
              <Mic
                className="w-3.5 h-3.5"
                style={{
                  color: "#FFFFFF",
                  strokeWidth: 2.5,
                }}
              />
            </motion.button>

            {/* Video Button */}
            <motion.button
              className="flex items-center justify-center p-2.5 rounded-full"
              style={{
                background: "rgba(255, 255, 255, 0.2)",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                cursor: "pointer",
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Video
                className="w-3.5 h-3.5"
                style={{
                  color: "#FFFFFF",
                  strokeWidth: 2.5,
                }}
              />
            </motion.button>
          </div>
        </div>

        {/* Subtle activity pulse */}
        <motion.div
          className="absolute top-3 left-4 w-2 h-2 rounded-full"
          style={{
            background: "#22C55E",
            boxShadow: "0 0 8px rgba(34, 197, 94, 0.6)",
          }}
          animate={{
            opacity: [0.6, 1, 0.6],
            scale: [1, 1.2, 1],
                }}
                transition={{
            duration: 2,
            repeat: Infinity,
                  ease: "easeInOut",
          }}
        />
      </div>
    </motion.div>
  );
}

// Light card with buyer matching animation (Card 3)
function LightCardWithBuyerMatching({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <motion.div
      className="relative overflow-hidden rounded-3xl p-8 h-full min-h-[420px]"
      style={{
        backgroundColor: "#F7F9FC",
        border: "1px solid rgba(0, 0, 0, 0.08)",
      }}
      whileHover={{
        y: -4,
      }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {/* Clean Spotlight Alignment Animation */}
      <CleanSpotlightAlignment />

      {/* Overlay that fades animation into card background */}
      <div
        className="absolute inset-x-0 top-0 pointer-events-none z-10"
        style={{
          height: "340px",
          background:
            "linear-gradient(to bottom, rgba(247, 249, 252, 0), rgba(247, 249, 252, 0.05) 20%, rgba(247, 249, 252, 0.15) 35%, rgba(247, 249, 252, 0.35) 50%, rgba(247, 249, 252, 0.55) 65%, rgba(247, 249, 252, 0.75) 80%, rgba(247, 249, 252, 0.92) 92%, #F7F9FC 100%)",
        }}
      />

      {/* Content */}
      <div className="relative z-20 flex flex-col justify-end" style={{ minHeight: "360px" }}>
        <div className="space-y-3">
          <h3
            style={{
              fontFamily: "Inter, system-ui, sans-serif",
              fontSize: "18px",
              fontWeight: 500,
              lineHeight: "140%",
              color: "#1B1F23",
            }}
          >
            {title}
          </h3>
          <p
            style={{
              fontSize: "14px",
              lineHeight: "140%",
              color: "#6B7280",
            }}
          >
            {description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

// Clean Spotlight Alignment Animation Component
function CleanSpotlightAlignment() {
  const spotlightDelay = 1.2;
  const spotlightDuration = 1.5;

  return (
    <motion.div
      className="absolute top-0 left-0 right-0 z-0"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        ease: "easeOut",
        delay: 0.2,
      }}
      style={{
        height: "280px",
        padding: "20px",
      }}
    >
      <div
        className="relative w-full h-full rounded-2xl overflow-hidden"
        style={{
          background: "rgba(255, 255, 255, 0.98)",
          border: "1px solid rgba(0, 0, 0, 0.08)",
          boxShadow:
            "0 20px 40px rgba(0, 0, 0, 0.08), inset 0 1px 2px rgba(255, 255, 255, 0.9)",
        }}
      >
        {/* Content */}
        <div className="p-5 space-y-4">
          {/* Property Card */}
          <div
            className="p-3 rounded-lg"
            style={{
              background: "#F9FAFB",
              border: "1px solid #E5E7EB",
            }}
          >
            <div className="flex items-start gap-3">
              <div
                className="w-12 h-12 rounded-md flex-shrink-0"
                style={{
                  background: "linear-gradient(135deg, #2D7FFF, #609BFF)",
                }}
              />
              <div className="flex-1">
                <div
                  style={{
                    fontFamily: "Inter, system-ui, sans-serif",
                    fontSize: "11px",
                    fontWeight: 700,
                    color: "#1B1F23",
                    marginBottom: "3px",
                  }}
                >
                  Modern Townhouse
                </div>
                <div
                  style={{
                    fontFamily: "Inter, system-ui, sans-serif",
                    fontSize: "9px",
                    fontWeight: 500,
                    color: "#6B7280",
                  }}
                >
                  Downtown • $650K
                </div>
              </div>
            </div>
          </div>

          {/* Connector Animation */}
          <div className="relative flex items-center justify-center py-2">
            <motion.div
              className="absolute inset-x-0 h-0.5"
              style={{
                background:
                  "linear-gradient(90deg, transparent, #2D7FFF, transparent)",
              }}
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: [0, 1, 0.4] }}
              transition={{
                delay: spotlightDelay,
                duration: spotlightDuration,
                ease: "easeInOut",
              }}
            />
            
            <motion.div
              className="relative z-10 p-2 rounded-full"
              style={{
                background: "linear-gradient(135deg, #2D7FFF, #609BFF)",
                boxShadow: "0 4px 16px rgba(45, 127, 255, 0.3)",
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                delay: spotlightDelay + spotlightDuration * 0.5,
                duration: 0.4,
                type: "spring",
              }}
            >
              <Target className="w-3 h-3" style={{ color: "white" }} />
            </motion.div>
          </div>

          {/* Matched Buyer Card */}
          <motion.div
            className="relative p-3 rounded-lg"
            style={{
              background: "#F9FAFB",
              border: "1px solid #E5E7EB",
            }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: spotlightDelay + spotlightDuration,
              duration: 0.5,
            }}
          >
            <div className="flex items-start gap-3">
              <div
                className="w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, #10B981, #34D399)",
                }}
              >
                <User className="w-5 h-5" style={{ color: "white" }} />
              </div>
              <div className="flex-1">
                <div
                  style={{
                    fontFamily: "Inter, system-ui, sans-serif",
                    fontSize: "11px",
                    fontWeight: 700,
                    color: "#1B1F23",
                    marginBottom: "3px",
                  }}
                >
                  3 Bed Condo
                </div>
                <div
                  style={{
                    fontFamily: "Inter, system-ui, sans-serif",
                    fontSize: "9px",
                    fontWeight: 500,
                    color: "#6B7280",
                  }}
                >
                  Downtown • $450K
                </div>
              </div>
            </div>

            {/* Subtle glow indicator */}
            <motion.div
              className="absolute -top-2 -right-2 p-1 rounded-full"
              style={{
                background: "linear-gradient(135deg, #2D7FFF, #609BFF)",
                boxShadow: "0 2px 8px rgba(45, 127, 255, 0.3)",
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: 1, 
                opacity: 1,
              }}
              transition={{
                delay: spotlightDelay + spotlightDuration + 0.6,
                duration: 0.4,
                type: "spring",
              }}
            >
              <Sparkles className="w-2.5 h-2.5" style={{ color: "white" }} />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
