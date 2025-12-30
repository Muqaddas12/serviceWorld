

'use server'

import React from 'react'

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
<>

      <MainTop websiteName={websiteName}/>
      <WhyChooseUs/>
      <HowItWorks/>
      <FaqSection/>
      {/* <PaymentMethods/> */}

</>
     

  )
}
