"use client";
import Link from "next/link";

export default function FaqSection({dark=false}) {
  const faqs = [
    {
      q: "What is SMM PANEL?",
      a: (
        <>
          <Link href="/" className="text-[#4A6CF7] hover:underline">
            SMM panel
          </Link>{" "}
          is a platform where you can buy social media followers, likes, views,
          comments, subscribers, and even website traffic. Users choose the{" "}
          <Link href="/" className="text-[#4A6CF7] hover:underline">
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
          <Link href="/blog" className="text-[#4A6CF7] hover:underline">
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
      className="py-20 px-6 bg-[#F5F7FA] dark:bg-[#0F1117] text-[#1A1A1A] dark:text-white transition-colors"
    >
      {/* Heading */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

        {/* Left Content */}
        <div className="space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold text-[#4A6CF7] leading-snug">
            Frequently Asked Questions
          </h2>

          <p className="text-[#4A5568] dark:text-[#A0AEC3] text-base leading-relaxed">
            Our SMM Panel allows you to purchase real engagement including
            followers, likes, views, and more.
            Here are answers to the most common questions to help you understand how the{" "}
            <span className="font-semibold text-[#4A6CF7]">Cheapest SMM Panel</span> works.
          </p>

          <Link
            href="/faq"
            className="inline-block bg-[#4A6CF7] hover:bg-[#3f5ed8] text-white font-semibold px-6 py-3 rounded-xl shadow-lg transition"
          >
            View All FAQ
          </Link>
        </div>

        {/* Right Accordion */}
        {/* <div>
          <div className="space-y-4">
            {faqs.map((item, i) => (
              <Accordion key={i} question={item.q} answer={item.a} />
            ))}
          </div>
        </div> */}
      </div>
    </section>
  );
}

// Accordion Component
function Accordion({ question, answer }) {
  return (
    <details className="group border border-[#4A6CF7]/20 rounded-xl overflow-hidden bg-white dark:bg-[#1A1F2B] shadow-lg">
      {/* Header */}
      <summary className="flex justify-between items-center cursor-pointer bg-white dark:bg-[#1A1F2B] hover:bg-[#F5F7FA] dark:hover:bg-[#161A23] px-5 py-4 font-semibold text-[#1A1A1A] dark:text-white transition-all">
        {question}
        <span className="transition-transform group-open:rotate-180 text-[#4A6CF7]">
          ▼
        </span>
      </summary>

      {/* Body */}
      <div className="px-5 py-4 text-[#4A5568] dark:text-[#A0AEC3] text-sm leading-relaxed bg-[#F5F7FA] dark:bg-[#0F1117] border-t border-[#4A6CF7]/20">
        {answer}
      </div>
    </details>
  );
}
