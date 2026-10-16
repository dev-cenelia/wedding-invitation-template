import {
  BRIDE_FULLNAME,
  GROOM_FULLNAME,
  LOCATION,
  WEDDING_DATE,
} from "../../const"
import { COVER_IMAGES } from "../../images"
import { LazyDiv } from "../lazyDiv"
import { useEffect, useState } from "react"

/**
 * 초대장의 메인 커버 섹션입니다.
 * 예식 일시, 신랑/신부 이름, 장소를 표시합니다.
 *
 * @returns {JSX.Element} 커버 섹션
 */
export const Cover = () => {
  const [currentImage, setCurrentImage] = useState(0)

  useEffect(() => {
    if (COVER_IMAGES.length <= 1) return

    const timer = window.setInterval(() => {
      setCurrentImage((image) => (image + 1) % COVER_IMAGES.length)
    }, 3600)

    return () => window.clearInterval(timer)
  }, [])

  return (
    <LazyDiv className="cover">
      <div className="subtitle">The Wedding Day</div>
      {/* 이름 표시 */}
      <div className="names">
        <span>{GROOM_FULLNAME}</span>
        <span className="and">&</span>
        <span>{BRIDE_FULLNAME}</span>
      </div>

      {/* 커버 이미지 */}
      <div className="image-wrapper">
        {COVER_IMAGES.map((image, index) => (
          <img
            key={image}
            src={image}
            alt="sample"
            className={index === currentImage ? "active" : ""}
          />
        ))}
      </div>

      {/* 예식 정보 (포맷팅된 날짜 및 장소) */}
      {/* 상단 날짜 표시 */}
      <div className="wedding-date">
        {WEDDING_DATE.format("YYYY년 MM월 DD일 dddd A hh시mm분")}
      </div>
      <div className="wedding-day-of-week">{LOCATION}</div>
      {/* 요일 표시 (영어) */}
    </LazyDiv>
  )
}
