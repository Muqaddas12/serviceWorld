"use client";
import Image from "next/image";
import { motion } from "framer-motion";


export default function Loader({ message = "Loading..." }) {
 
 

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm">
      <motion.div
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
       
      >
        <div className=" flex items-center justify-center">
          <Image src="/fav.png" alt="Logo" width={100} height={100} priority  className="rounded-full"/>
        </div>
      </motion.div>

      {message && (
        <p className="mt-5 text-sm text-gray-300 tracking-wide">
          {message}
        </p>
      )}
    </div>
  );
}
