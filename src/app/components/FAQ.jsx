"use client";
import { motion } from "framer-motion";
import Link from "next/link";

export default function FaqSection() {
  const faqs = [
    {
      q: "What is SMM PANEL?",
      a: (
        <>
          <Link href="/" className="text-yellow-400 hover:underline">
            SMM panel
          </Link>{" "}
          is a platform where you can buy social media followers, likes, views,
          comments, subscribers, and even website traffic. Users choose the{" "}
          <Link href="/" className="text-yellow-400 hover:underline">
            cheapest smm panel
          </Link>{" "}
          for low prices, fast delivery, and a wide range of services.
        </>
      ),
    },
    {
      q: "Is SMM Panel Safe?",
      a: "Yes! Our SMM panels are secure, updated regularly, and protected against DDoS attacks. SSL encryption ensures complete data privacy for you and your clients.",
    },
    {
      q: "How does Cheapest SMM Panel work?",
      a: "Our panel connects you with real and targeted users. When you place an order, we deliver premium engagement automatically to boost your social presence.",
    },
    {
      q: "Which is the best SMM Panel?",
      a: (
        <>
          Cheapest SMM Panel is considered one of the best platforms due to its
          reliability, affordability, and service variety. Read more on our{" "}
          <Link href="/blog" className="text-yellow-400 hover:underline">
            blog
          </Link>
          .
        </>
      ),
    },
  ];

  return (
    <section
      id="faqSection"
      className="relative py-20 px-6 "
    >
      {/* ✨ Floating Golden Particles */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        {[...Array(50)].map((_, i) => {
          const size = Math.random() * 3 + 2;
          const startX = Math.random() * 100;
          const startY = Math.random() * 100;
          const endX = Math.random() * 100;
          const endY = Math.random() * 100;

          return (
            <motion.span
              key={i}
              initial={{ opacity: 0, x: `${startX}vw`, y: `${startY}vh` }}
              animate={{
                opacity: [0.15, 1, 0.15],
                x: [`${startX}vw`, `${endX}vw`, `${startX}vw`],
                y: [`${startY}vh`, `${endY}vh`, `${startY}vh`],
              }}
              transition={{
                duration: 12 + Math.random() * 6,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute bg-yellow-400 rounded-full blur-[2px]"
              style={{ width: size, height: size }}
            />
          );
        })}
      </div>

      {/* Yellow Glow Background */}
      <div className="absolute -top-32 -right-32 w-[400px] h-[400px] bg-yellow-500/20 rounded-full blur-[130px] opacity-30 -z-10"></div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        
        {/* LEFT CONTENT */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="space-y-6"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-yellow-400 leading-snug">
            Frequently Asked Questions
          </h2>

          <p className="text-gray-400 text-base leading-relaxed">
            Our SMM Panel allows you to purchase real engagement including
            followers, likes, views, and more.  
            Here are answers to the most common questions to help you understand
            how the{" "}
            <span className="font-semibold text-yellow-400">
              Cheapest SMM Panel
            </span>{" "}
            works.
          </p>

          <Link
            href="/faq"
            className="inline-block bg-gradient-to-r from-yellow-600 to-yellow-400 
                       text-black font-semibold px-6 py-3 rounded-xl 
                       shadow-[0_0_20px_rgba(255,221,64,0.3)] 
                       hover:shadow-[0_0_30px_rgba(255,221,64,0.5)] 
                       transition-all"
          >
            View All FAQ
          </Link>
        </motion.div>

        {/* RIGHT ACCORDION */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="space-y-4">
            {faqs.map((item, i) => (
              <Accordion key={i} question={item.q} answer={item.a} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ⚙️ Dark Yellow Accordion Component */
function Accordion({ question, answer }) {
  return (
    <details className="group border border-yellow-500/20 rounded-xl overflow-hidden bg-[#151517] shadow-[0_0_20px_rgba(255,221,64,0.08)]">
      
      {/* HEADER */}
      <summary className="flex justify-between items-center cursor-pointer 
                         bg-[#151517] hover:bg-[#1c1c1d] px-5 py-4 
                         font-semibold text-gray-200 transition-all">
        {question}
        <span className="transition-transform group-open:rotate-180 text-yellow-400">
          ▼
        </span>
      </summary>

      {/* CONTENT */}
      <div className="px-5 py-4 text-gray-400 text-sm leading-relaxed bg-[#0e0e0f] border-t border-yellow-500/20">
        {answer}
      </div>
    </details>
  );
}
