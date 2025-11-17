import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";

export default function FAQSection() {
  const faqs = [
    {
      question: "What does Smart Realtor Tools actually do?",
      answer: "Smart Realtor Tools uses AI and real-time market data to instantly analyze any property and generate a tailored marketing plan—giving agents and sellers accurate insights in seconds."
    },
    {
      question: "How accurate is the AI analysis?",
      answer: "Our system pulls live data from trusted real estate sources, MLS feeds, and market analytics partners. The AI cross-checks multiple data points to deliver precise, reliable scores and recommendations."
    },
    {
      question: "Is my property data private and secure?",
      answer: "Absolutely. All data is encrypted, never sold, and only used to generate your analysis. Your information stays private to your account."
    },
    {
      question: "Where does the data come from?",
      answer: "We use verified real estate datasets, MLS integrations, public records, and market analytics tools. Everything is refreshed continuously to reflect current market conditions."
    },
    {
      question: "Does this replace a real estate agent?",
      answer: "No. Smart Realtor Tools is built to enhance and empower agents—not replace them. It saves hours of manual research and gives you client-ready insights instantly."
    }
  ];

  return (
    <div className="max-w-3xl mx-auto px-6 py-24">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <Accordion type="single" collapsible className="space-y-0">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
            >
              <AccordionItem
                value={`item-${index}`}
                className="border-b border-slate-200 last:border-b-0"
              >
                <AccordionTrigger className="hover:no-underline py-8 text-left">
                  <span 
                    className="text-slate-900 font-semibold"
                    style={{ fontSize: "16px" }}
                  >
                    {faq.question}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pb-8">
                  <p 
                    className="text-slate-600 max-w-2xl"
                    style={{ fontSize: "12px" }}
                  >
                    {faq.answer}
                  </p>
                </AccordionContent>
              </AccordionItem>
            </motion.div>
          ))}
        </Accordion>
      </motion.div>
    </div>
  );
}

