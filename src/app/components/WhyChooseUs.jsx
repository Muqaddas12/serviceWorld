"use client";
import Image from "next/image";
import { motion } from "framer-motion";

export default function WhyChooseUs() {
  const items = [
    {
      title: "Affordable Reseller Panel",
      img: "https://storage.perfectcdn.com/81013d/aknlg99zmlyxld13.jpg",
      desc: "We provide the most affordable SMM panel at unbeatable prices, suitable for every business regardless of size.",
    },
    {
      title: "Secure Transactions & Reliable Services",
      img: "https://storage.perfectcdn.com/81013d/05iccly8ef7836xq.jpg",
      desc: "All transactions are encrypted and secure. Focus on growing your social presence with peace of mind.",
    },
    {
      title: "Complete Privacy",
      img: "https://storage.perfectcdn.com/81013d/te8tx9p8u1bhh465.jpg",
      desc: "We ensure your privacy and confidentiality while you use our top-tier SMM services.",
    },
    {
      title: "Instant Activation, No Hassle",
      img: "https://storage.perfectcdn.com/81013d/z535zficrooghhmr.jpg",
      desc: "Enjoy instant activation—no delays, no waiting. Start boosting your presence immediately.",
    },
  ];

  return (
    <section
      id="why-choose"
      className="relative px-6 md:px-12 overflow-hidden"
    >
      {/* ✨ Moving Gold Particles Background */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        {[...Array(45)].map((_, i) => {
          const size = Math.random() * 3 + 2; // 2px - 5px
          const startX = Math.random() * 100;
          const startY = Math.random() * 100;
          const endX = Math.random() * 100;
          const endY = Math.random() * 100;

          return (
            <motion.span
              key={i}
              initial={{ opacity: 0, x: `${startX}vw`, y: `${startY}vh` }}
              animate={{
                opacity: [0.1, 0.8, 0.1],
                x: [`${startX}vw`, `${endX}vw`, `${startX}vw`],
                y: [`${startY}vh`, `${endY}vh`, `${startY}vh`],
              }}
              transition={{
                duration: 15 + Math.random() * 15,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute bg-yellow-400 rounded-full blur-[2px]"
              style={{ width: size, height: size }}
            />
          );
        })}
      </div>

      {/* ⭐ Heading */}
      <div className="text-center mb-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-yellow-400 flex items-center justify-center gap-3">
            <svg
              width="26"
              height="26"
              viewBox="0 0 26 26"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M13 25.5C6.09644 25.5 0.5 19.9035 0.5 13C0.5 6.09644 6.09644 0.5 13 0.5C19.9035 0.5 25.5 6.09644 25.5 13C25.5 19.9035 19.9035 25.5 13 25.5ZM13 23C18.5229 23 23 18.5229 23 13C23 7.47715 18.5229 3 13 3C7.47715 3 3 7.47715 3 13C3 18.5229 7.47715 23 13 23ZM11.75 16.75H14.25V19.25H11.75V16.75ZM14.25 14.6939V15.5H11.75V13.625C11.75 12.9346 12.3096 12.375 13 12.375C14.0355 12.375 14.875 11.5355 14.875 10.5C14.875 9.46446 14.0355 8.625 13 8.625C12.0904 8.625 11.332 9.27279 11.161 10.1322L8.70914 9.64183C9.10796 7.63649 10.8775 6.125 13 6.125C15.4163 6.125 17.375 8.08375 17.375 10.5C17.375 12.4819 16.0571 14.156 14.25 14.6939Z"
                fill="#FACC15"
              />
            </svg>
            Why Choose Us
          </h2>

          <p className="text-gray-400 mt-3 text-lg">
            We make your growth faster, smarter, and effortless.
          </p>
        </motion.div>
      </div>

      {/* ⭐ Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
        {items.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="
                      
                       transition-all duration-300 text-center 
                       flex flex-col items-center"
          >
            <div className="w-20 h-20 mb-4 relative rounded-full overflow-hidden border border-yellow-500/20 shadow-[0_0_10px_rgba(255,221,64,0.2)]">
              <Image
                src={item.img}
                alt={item.title}
                fill
                className="object-cover"
              />
            </div>

            <h3 className="text-lg font-semibold text-yellow-400 mb-2">
              {item.title}
            </h3>

            <p className="text-gray-400 text-sm">{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
