import { Map } from "./map"
import { LazyDiv } from "../lazyDiv"
import { LOCATION, LOCATION_ADDRESS } from "../../const"
import { FiCopy } from "react-icons/fi"

const ROAD_ADDRESS =
  "서울특별시 영등포구 문래로 164 SK리더스뷰 4층 JK아트컨벤션"
const JIBUN_ADDRESS =
  "서울특별시 영등포구 문래동3가 55-16번지 SK리더스뷰 4층 JK아트컨벤션"

const LOCATION_ADDRESS_LINES = [
  "서울특별시 영등포구 문래로 164",
  "문래동3가 55-16번지",
  "SK리더스뷰 4층 JK아트컨벤션",
]

const copyAddress = async (address: string) => {
  await navigator.clipboard.writeText(address)
  alert("주소가 복사되었습니다.")
}

const CopyableAddress = ({
  label,
  address,
}: {
  label: string
  address: string
}) => (
  <div className="copyable-address">
    <span className="address-label">{label}</span>
    <div className="address-value">
      <span className="address-text">{address}</span>
      <button
        type="button"
        className="address-copy-button"
        aria-label={`${label} 복사하기`}
        onClick={() => copyAddress(address)}
      >
        <FiCopy />
      </button>
    </div>
  </div>
)

/**
 * 오시는 길 정보를 표시하는 컴포넌트입니다.
 * 지도와 대중교통, 자가용 이용 방법을 안내합니다.
 *
 * @returns {JSX.Element} 오시는 길 섹션
 */
export const Location = () => {
  return (
    <LazyDiv className="card location">
      <div className="location-place">
        <h2 className="english">Location</h2>
        <div className="location-subtitle">오시는 길</div>
        <div className="addr">
          {LOCATION}
          <div className="detail">
            {LOCATION_ADDRESS_LINES.map((line) => (
              <span key={line} className="detail-line">
                <span>{line}</span>
                <button
                  type="button"
                  className="address-copy-button"
                  aria-label={`${line} 복사하기`}
                  onClick={() => copyAddress(line)}
                >
                  <FiCopy />
                </button>
              </span>
            ))}
          </div>
        </div>
        <Map />
      </div>

      <div className="location-info-list">
        <div className="location-info">
          <div className="heading">지하철</div>
          <div className="content">
            <p>
              <span className="subway-label">2호선</span> 문래역 하차
              <br />
              셔틀버스 : 4번출구(뒷쪽) 셔틀버스 운행
              <br />
              도보이용 : 5번출구에서 전방 직진 300M
            </p>
          </div>

          <div className="heading">버스</div>
          <div className="content">
            <p>
              문래역 정류장 하차
              <br />
              <span className="bus-label-green">지선버스</span>6211, 6625
              <br />
              <span className="bus-label-blue">간선버스</span>641
              <br />
              <span className="bus-label-lightgreen">마을버스</span>영등포12
              <br />
              문래주민센터 / 영일시장.록스 정류장 하차
              <br />
              <span className="bus-label-lightgreen">마을버스</span>영등포05
              <br />
              벽산메가트리움APT 정류장 하차
              <br />
              <span className="bus-label-green">지선버스</span>6516
            </p>
          </div>
          <div className="heading">자가용</div>
          <div className="content">
            네이버 지도, 카카오 네비, 티맵 등 이용
            <br />
            "JK아트컨벤션" 또는 "문래동 SK리더스뷰" 입력
            <br />
            주차장 : 동시 1,000여대 주차 가능
            <br />
            <br />
            <div className="address-list">
              <CopyableAddress label="도로명 주소" address={ROAD_ADDRESS} />
              <CopyableAddress label="지번 주소" address={JIBUN_ADDRESS} />
            </div>
          </div>
        </div>
      </div>
    </LazyDiv>
  )
}
