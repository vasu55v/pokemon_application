import React from 'react'

const LoadingState = () => {
  return (
    <div className="flex flex-col items-center justify-center p-16">
      <div className="relative w-20 h-20">
        <div className="absolute top-0 bg-red-600 w-20 h-10 rounded-t-full"></div>
        <div className="absolute bottom-0 bg-white w-20 h-10 rounded-b-full"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-white w-6 h-6 rounded-full animate-ping"></div>
        </div>
      </div>
      <p className="mt-6 text-gray-600 font-medium">Loading Pokémon data...</p>
    </div>
  )
}

export default LoadingState