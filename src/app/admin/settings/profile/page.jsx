'use server'


export default async function Page() {
  try {
 

  

    // 🧩 Render admin profile
    return (
      <div className="min-h-screen bg-[#0b0b0c] text-gray-100 flex items-center justify-center p-6">
        <div className="bg-[#151517] border border-yellow-500/20 rounded-2xl shadow-[0_0_25px_rgba(250,204,21,0.1)] p-8 w-[90%] max-w-md text-center">
          <h1 className="text-3xl font-bold text-yellow-400 mb-4">
            Admin Profile
          </h1>

        </div>
      </div>
    )
  } catch (error) {
    console.error('Profile page error:', error)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-400 text-lg">
        ❌ Something went wrong while loading profile.
      </div>
    )
  }
}
