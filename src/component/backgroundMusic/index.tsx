import { useRef, useState } from "react"
import { FiMusic, FiPause, FiPlay } from "react-icons/fi"

export const BackgroundMusic = () => {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const toggleMusic = async () => {
    const audio = audioRef.current
    if (!audio || isLoading) return

    if (!audio.paused) {
      audio.pause()
      return
    }

    setError("")
    setIsLoading(true)
    try {
      await audio.play()
    } catch {
      setError("음악을 재생하지 못했어요. 다시 눌러주세요.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="background-music">
      <audio
        ref={audioRef}
        src={`${import.meta.env.BASE_URL}audio/Sunlit_String_Waltz.mp3`}
        loop
        preload="none"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onError={() => {
          setIsPlaying(false)
          setError("음악을 불러오지 못했어요. 다시 눌러주세요.")
        }}
      />
      <button
        type="button"
        onClick={toggleMusic}
        disabled={isLoading}
        aria-label={isPlaying ? "배경음악 일시정지" : "배경음악 재생"}
        aria-pressed={isPlaying}
        aria-busy={isLoading}
        title="Sunlit String Waltz"
      >
        <FiMusic aria-hidden="true" />
        {isPlaying ? <FiPause aria-hidden="true" /> : <FiPlay aria-hidden="true" />}
      </button>
      <span className="music-status" role="status">{error}</span>
    </div>
  )
}
