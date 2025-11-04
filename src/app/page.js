

'use client'

import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import Header from './components/Header'
import Footer from './components/Footer'


import WhyChooseUs from './components/WhyChooseUs'
import MainTop from './components/MainTop'
import PaymentMethods from './components/PaymentMethods'
import FaqSection from './components/FAQ'
import HowItWorks from './components/HowItWork'
import { getSettings } from '@/lib/adminServices'

export default function Home() {

  return (
    <main className="min-h-screen bg-gray-50 text-slate-900">
      <Header />
      <MainTop/>
      <WhyChooseUs/>
      <HowItWorks/>
      <FaqSection/>
      <PaymentMethods/>
      <Footer/>
    </main>
  )
}
