'use server'
import LoginForm from "./LoginForm";
import Navbar from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { getWebsiteSettings } from "@/lib/adminServices";
export default async function Login(){
    const siteSetting=await getWebsiteSettings()
    const settings=await JSON.parse(siteSetting.plainsettings)
    
   return (
    <>
    <div className="bg-gradient-to-br from-indigo-700 via-purple-700 to-pink-600">
<Navbar logo={settings.logo }/>
    <LoginForm/>
    <Footer siteName={settings.siteName}/>
    </div>
    
    </>
   ) 
}