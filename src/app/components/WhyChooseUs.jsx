"use client";
import Image from "next/image";
import { motion } from "framer-motion";

export default function WhyChooseUs() {
  const items = [
    {
      title: "Affordable Reseller Panel",
      img: "https://storage.perfectcdn.com/81013d/aknlg99zmlyxld13.jpg",
      desc: "We provide the most affordable SMM panel at unbeatable prices, suitable for every business regardless of size. Our goal is to offer clients the most cost-effective panel available.",
    },
    {
      title: "Secure Transactions & Reliable Services",
      img: "https://storage.perfectcdn.com/81013d/05iccly8ef7836xq.jpg",
      desc: "With SMM Panel, every transaction is secure and dependable. Our encrypted payment gateways protect your information, so you can focus on growing your social presence.",
    },
    {
      title: "Complete Privacy",
      img: "https://storage.perfectcdn.com/81013d/te8tx9p8u1bhh465.jpg",
      desc: "We value your privacy above all. Our platform guarantees top-tier SMM services while maintaining complete confidentiality for every transaction you perform.",
    },
    {
      title: "Instant Activation, No Hassle",
      img: "https://storage.perfectcdn.com/81013d/z535zficrooghhmr.jpg",
      desc: "Experience instant activation—no delays, no waiting. Every order is delivered immediately so you can start boosting your presence right away.",
    },
  ];

  return (
    <section
      id="why-choose"
      className="bg-white shadow-md rounded-tl-[50px] rounded-br-[50px] py-16 px-6 md:px-12 mt-10"
    >
      <div className="text-center mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 flex items-center justify-center gap-3">
            <svg
              width="26"
              height="26"
              viewBox="0 0 26 26"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-blue-600"
            >
              <path
                d="M13 25.5C6.09644 25.5 0.5 19.9035 0.5 13C0.5 6.09644 6.09644 0.5 13 0.5C19.9035 0.5 25.5 6.09644 25.5 13C25.5 19.9035 19.9035 25.5 13 25.5ZM13 23C18.5229 23 23 18.5229 23 13C23 7.47715 18.5229 3 13 3C7.47715 3 3 7.47715 3 13C3 18.5229 7.47715 23 13 23ZM11.75 16.75H14.25V19.25H11.75V16.75ZM14.25 14.6939V15.5H11.75V13.625C11.75 12.9346 12.3096 12.375 13 12.375C14.0355 12.375 14.875 11.5355 14.875 10.5C14.875 9.46446 14.0355 8.625 13 8.625C12.0904 8.625 11.332 9.27279 11.161 10.1322L8.70914 9.64183C9.10796 7.63649 10.8775 6.125 13 6.125C15.4163 6.125 17.375 8.08375 17.375 10.5C17.375 12.4819 16.0571 14.156 14.25 14.6939Z"
                fill="#2563EB"
              />
            </svg>
            Why Choose Us
          </h2>
          <p className="text-gray-600 mt-3 text-lg">
            We make life easier by boosting your growth.
          </p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {items.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="bg-gray-50 p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 text-center flex flex-col items-center"
          >
            <div className="w-20 h-20 mb-4 relative">
              <Image
                src={item.img}
                alt={item.title}
                fill
                className="rounded-full object-cover"
              />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {item.title}
            </h3>
            <p className="text-gray-600 text-sm">{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
