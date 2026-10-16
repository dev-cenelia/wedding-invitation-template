import { useEffect, useState } from "react"
import "./index.scss"

export function Intro() {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = window.setTimeout(() => setIsVisible(false), 5000)
    const hideIntro = () => setIsVisible(false)

    window.addEventListener("scroll", hideIntro, { passive: true, once: true })
    window.addEventListener("wheel", hideIntro, { passive: true, once: true })
    window.addEventListener("touchmove", hideIntro, { passive: true, once: true })

    return () => {
      window.clearTimeout(timer)
      window.removeEventListener("scroll", hideIntro)
      window.removeEventListener("wheel", hideIntro)
      window.removeEventListener("touchmove", hideIntro)
    }
  }, [])

  if (!isVisible) {
    return null
  }

  return (
    <div className="intro" aria-hidden="true">
      <div className="intro-frame">
        <div className="intro-image-wrap">
          <img className="intro-image" src="/intro_poster_img.webp" alt="" />
        </div>
        {/*
        <div className="intro-text">
          <span>해강 그리고 샛별,</span>
          <span>저희 두사람 결혼합니다</span>
          <span>그 첫 걸음으로</span>
          <span>축복해 주시면 감사하겠습니다</span>
        </div>
        */}
      </div>
    </div>
  )
}
