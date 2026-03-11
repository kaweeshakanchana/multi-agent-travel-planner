import React, { useState } from 'react'
import ChatPanel from './components/ChatPanel'
import SummaryPanel from './components/SummaryPanel'
import './index.css'

function App() {
  const [data, setData] = useState({
    requirements: null,
    itinerary: null,
    bookings: null
  });

  return (
    <>
      <div className="background-overlay"></div>
      <div className="app-container">
        <ChatPanel onUpdateSummary={(newData) => setData(newData)} />
        <SummaryPanel data={data} />
      </div>
    </>
  )
}

export default App
