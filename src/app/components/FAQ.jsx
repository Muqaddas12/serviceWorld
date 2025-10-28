"use client";
import { motion } from "framer-motion";
import Link from "next/link";

export default function FaqSection() {
  const faqs = [
    {
      q: "What is SMM PANEL?",
      a: (
        <>
          <Link href="/" className="text-blue-600 hover:underline">
            SMM panel
          </Link>{" "}
          is a panel where you can buy social media (Facebook, Twitter,
          Instagram, YouTube, Spotify, TikTok, etc.) likes, followers, views,
          comments, subscribers, and even website traffic. Customers choose the{" "}
          <Link href="/" className="text-blue-600 hover:underline">
            cheapest smm panel
          </Link>{" "}
          for its low prices, fast delivery, and wide range of services — all in
          one place.
        </>
      ),
    },
    {
      q: "Is SMM Panel Safe?",
      a: "Yes! Our SMM panels are extremely secure, protected from DDoS attacks, and updated regularly. Each service is SSL-certified to protect both your and your clients' data privacy.",
    },
    {
      q: "How does Cheapest SMM Panel work?",
      a: "Our panel connects you with real and targeted social media users. When you order, we help boost your engagement, brand awareness, and conversions across platforms like Facebook and Instagram.",
    },
    {
      q: "Which is the best SMM Panel?",
      a: (
        <>
          Cheapest SMM Panel is widely recognized as the best SMM reseller
          platform because of our reliability, affordability, and variety of
          services. Learn more on our{" "}
          <Link href="/blog" className="text-blue-600 hover:underline">
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
      className="relative py-20 px-6 bg-white overflow-hidden rounded-3xl shadow-md mt-20"
    >
      {/* 🌈 Gradient Circle Background */}
      <div className="absolute -top-32 -right-32 w-[400px] h-[400px] bg-gradient-to-tr from-blue-500 via-indigo-500 to-purple-500 rounded-full blur-3xl opacity-30 -z-10"></div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* LEFT CONTENT */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="space-y-6"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 leading-snug">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-600 text-base leading-relaxed">
            Our SMM Panel helps you buy targeted actions like followers, likes,
            subscribers, and views. But we also know you might have questions.
            So here are answers to the most common ones — to help you understand
            how the{" "}
            <span className="font-semibold text-blue-600">
              Cheapest SMM Panel
            </span>{" "}
            works and how easily you can grow your business with us.
          </p>

          <Link
            href="/faq"
            className="inline-block bg-gradient-to-r from-blue-600 to-indigo-500 text-white font-semibold px-6 py-3 rounded-xl shadow-md hover:opacity-90 transition-all"
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

/* ⚙️ Accordion Component */
function Accordion({ question, answer }) {
  return (
    <details className="group border border-gray-200 rounded-xl overflow-hidden shadow-sm">
      <summary className="flex justify-between items-center cursor-pointer bg-gray-50 hover:bg-gray-100 px-5 py-4 font-semibold text-gray-800 transition-all">
        {question}
        <span className="transition-transform group-open:rotate-180 text-blue-600">
          ▼
        </span>
      </summary>
      <div className="px-5 py-4 text-gray-600 text-sm leading-relaxed bg-white border-t border-gray-100">
        {answer}
      </div>
    </details>
  );
}
