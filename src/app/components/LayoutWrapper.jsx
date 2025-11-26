"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Header";
import Footer from "./Footer";

export default function LayoutWrapper({ children, logo, siteName }) {

  const pathname = usePathname();
 

  // hide on /user/* and /admin/*
  const hide =
    pathname.startsWith("/user") || pathname.startsWith("/admin");

  return (
    <>
      {!hide && <Navbar logo={logo} siteName={siteName} />}
      {children}
      {!hide && <Footer siteName={siteName} />}
    </>
  );
}
