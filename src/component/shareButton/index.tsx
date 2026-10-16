import {
  BRIDE_FULLNAME,
  GROOM_FULLNAME,
  LOCATION,
  WEDDING_DATE,
  WEDDING_DATE_FORMAT,
} from "../../const"
import ktalkIcon from "../../icons/ktalk-icon.png"
import { LazyDiv } from "../lazyDiv"
import { useKakao } from "../store"

export const ShareButton = () => {
  const kakao = useKakao()

  return (
    <LazyDiv className="footer share-button">
      <button
        className="ktalk-share"
        onClick={() => {
          if (!kakao) return

          const siteUrl = window.location.origin

          kakao.Share.sendDefault({
            objectType: "feed",
            content: {
              title: `${GROOM_FULLNAME} ❤️ ${BRIDE_FULLNAME}의 결혼식에 초대합니다.`,
              description:
                WEDDING_DATE.format(WEDDING_DATE_FORMAT) + "\n" + LOCATION,
              imageUrl: `${siteUrl}/og_img.webp`,
              link: {
                mobileWebUrl: siteUrl,
                webUrl: siteUrl,
              },
            },
            buttons: [
              {
                title: "청첩장 보기",
                link: {
                  mobileWebUrl: siteUrl,
                  webUrl: siteUrl,
                },
              },
            ],
          })
        }}
      >
        <img src={ktalkIcon} alt="ktalk-icon" /> 카카오톡으로 공유하기
      </button>
    </LazyDiv>
  )
}