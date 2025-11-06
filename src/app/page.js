

'use server'

import React from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import WhyChooseUs from './components/WhyChooseUs'
import MainTop from './components/MainTop'
import PaymentMethods from './components/PaymentMethods'
import FaqSection from './components/FAQ'
import HowItWorks from './components/HowItWork'
import { getWebsiteSettings } from '@/lib/adminServices'

export default async function Home() {

const data= await getWebsiteSettings()
const result = JSON.parse(data.plainsettings)
const logo=result.logo
const websiteName=result.sietName

  return (
    <main className="min-h-screen bg-gray-50 text-slate-900">
      <Header logo={logo}/>
      <MainTop websiteName={websiteName}/>
      <WhyChooseUs/>
      <HowItWorks/>
      <FaqSection/>
      <PaymentMethods/>
      <Footer/>
    </main>
  )
}
