import { MessageCircle } from 'lucide-react'
import React from 'react'

function NavBar({authUser}) {
  return (
    <div className="border p-4 w-full">
      <div className="broder border-blue-400 max-w-3xl mx-auto flex justify-between">
        {/* Left container */}
        <div className="flex items-center space-x-4">
          <MessageCircle />
          <h2>HackChat</h2>
        </div>
        {/* RIght container */}
        <div className="flex items-center space-x-4">
          <MessageCircle />
          <h2>Settings</h2>
        </div>
      </div>
    </div>
  );
}

export default NavBar
