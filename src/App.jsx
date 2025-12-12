import { useState, useEffect } from 'react'
import { getUsers } from './lib/supabase'
import './App.css'

const rickRubinQuotes = [
  "The goal is to just get out of the way and let the art be what it is.",
  "Nothing is ever really finished. It's just due.",
  "We're not trying to make a hit record. We're trying to make something that lasts.",
  "The best work happens when you forget you're working.",
  "Stay in the moment. The magic is always there.",
  "Trust the process. Trust yourself.",
  "Creativity is not about perfection. It's about truth.",
  "Sometimes the quietest voice has the most to say."
]

const rickRubinPhotos = [
  "/rickrubin.jpeg",
  "/rickrubin2.jpeg",
  "/rickrubin3.jpeg",
  "/rickrubin4.jpeg"
]

function App() {
  const [vibeLevel, setVibeLevel] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [currentQuote, setCurrentQuote] = useState(rickRubinQuotes[0])
  const [currentPhoto, setCurrentPhoto] = useState(rickRubinPhotos[0])
  const [showQuote, setShowQuote] = useState(false)
  const [userName, setUserName] = useState('')

  const vibeStates = [
    { label: "START", color: "#333333", glow: "transparent" },
    { label: "FLOW", color: "#6366f1", glow: "rgba(99, 102, 241, 0.3)" },
    { label: "ZONE", color: "#8b5cf6", glow: "rgba(139, 92, 246, 0.4)" },
    { label: "DEEP", color: "#a855f7", glow: "rgba(168, 85, 247, 0.5)" },
    { label: "PEAK", color: "#d946ef", glow: "rgba(217, 70, 239, 0.6)" },
    { label: "TRANSCEND", color: "#f43f5e", glow: "rgba(244, 63, 94, 0.7)" }
  ]

  useEffect(() => {
    async function loadUser() {
      try {
        const users = await getUsers()
        if (users && users.length > 0) {
          setUserName(users[0].name)
        }
      } catch (error) {
        console.error('Error loading user:', error)
      }
    }
    loadUser()
  }, [])

  const handleVibeClick = () => {
    setIsAnimating(true)
    setVibeLevel((prev) => (prev + 1) % vibeStates.length)

    const randomQuote = rickRubinQuotes[Math.floor(Math.random() * rickRubinQuotes.length)]
    const randomPhoto = rickRubinPhotos[Math.floor(Math.random() * rickRubinPhotos.length)]
    setCurrentQuote(randomQuote)
    setCurrentPhoto(randomPhoto)
    setShowQuote(true)

    setTimeout(() => setIsAnimating(false), 300)
    setTimeout(() => setShowQuote(false), 7000)
  }

  const currentVibe = vibeStates[vibeLevel]
  const progress = (vibeLevel / (vibeStates.length - 1)) * 100
  const isFlowMode = vibeLevel >= 1

  return (
    <main className={`container ${isFlowMode ? 'flow-active' : ''}`}>
      {isFlowMode && <div className="flow-particles" />}
      <div className="content">
        <h1 className={`title ${isFlowMode ? 'title-glow' : ''}`}>VIBECODING</h1>

        <div
          className={`vibe-indicator ${isAnimating ? 'pulse' : ''} ${isFlowMode ? 'flow-mode' : ''}`}
          onClick={handleVibeClick}
          style={{
            borderColor: currentVibe.color,
            boxShadow: `0 0 60px ${currentVibe.glow}, inset 0 0 60px ${currentVibe.glow}`
          }}
        >
          <span className="vibe-label" style={{ color: currentVibe.color }}>
            {currentVibe.label}
          </span>
          <div className="vibe-progress">
            <div
              className="vibe-progress-fill"
              style={{
                width: `${progress}%`,
                background: `linear-gradient(90deg, #6366f1, ${currentVibe.color})`
              }}
            />
          </div>
          <span className="vibe-hint">click to vibe</span>
        </div>

        <div className={`quote-container ${showQuote ? 'visible' : ''}`}>
          <div className="rick-rubin">
            <img src={currentPhoto} alt="Rick Rubin" className="rick-avatar" />
            <div className="quote-content">
              <p className="quote-text">"{currentQuote}"</p>
              <span className="quote-author">Rick Rubin</span>
            </div>
          </div>
        </div>

        {userName && <p className="tagline">Hello {userName}</p>}
      </div>
    </main>
  )
}

export default App
