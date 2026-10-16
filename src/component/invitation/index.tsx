import {
  BRIDE_FULLNAME,
  BRIDE_INFO,
  BRIDE_FATHER,
  BRIDE_MOTHER,
  GROOM_FULLNAME,
  GROOM_INFO,
  GROOM_FATHER,
  GROOM_MOTHER,
  GROOM_TITLE,
  BRIDE_TITLE,
} from "../../const"
import { Modal } from "../modal"
import { Button } from "../button"
import { LazyDiv } from "../lazyDiv"
import { useState } from "react"
import { BiSolidPhoneCall } from "react-icons/bi"
import { FaRegMessage } from "react-icons/fa6"
import { RiDiamondRingFill } from "react-icons/ri"

const renderNameWithDeceasedMark = (name: string) => {
  if (!name.startsWith("故 ")) return name

  return (
    <>
      <span className="deceased-mark">故</span> {name.replace("故 ", "")}
    </>
  )
}

/**
 * 초대 메시지와 혼주 정보, 연락하기 기능을 제공하는 컴포넌트입니다.
 *
 * @returns {JSX.Element} 모시는 글 섹션
 */
export const Invitation = () => {
  const contactModalState = useState(false)
  const [contactSide, setContactSide] = useState<"groom" | "bride">("groom")
  return (
    <>
      <LazyDiv className="card invitation">
        <h2 className="english">Invitation</h2>

        {/* 초대 문구 */}
        <div className="content">많은 분들의 오랜 기다림과 축복 속에서,</div>
        <div className="content">저희 두 사람 더 깊어진 마음으로</div>
        <div className="content">한 길을 걸어가고자 합니다.</div>
        <div className="break" />
        <div className="content">20대의 풋풋했던 만남이</div>
        <div className="content">12년의 이야기를 담아</div>
        <div className="content">마침내 서로에게</div>
        <div className="content">가장 단단한 확신이 되었습니다.</div>
        <div className="break" />
        <div className="content">언제나 애정 어린 시선으로 지켜봐 주신</div>
        <div className="content">고마운 마음들을 늘 기억하며</div>
        <div className="content">예쁘게 살겠습니다.</div>
        <div className="break" />
        <div className="content">저희의 첫걸음에 귀한 걸음으로</div>
        <div className="content">함께 축복해 주세요.</div>
        <div className="break" />
        <div className="break" />

        {/* 혼주 및 신랑 정보 */}
        <div className="name">
          {GROOM_FATHER} · {GROOM_MOTHER}
          <span className="relation">
            의 <span className="relation-name">{GROOM_TITLE}</span>
          </span>{" "}
          {GROOM_FULLNAME}
        </div>
        {/* 혼주 및 신부 정보 */}
        <div className="name">
          {renderNameWithDeceasedMark(BRIDE_FATHER)} · {BRIDE_MOTHER}
          <span className="relation">
            의 <span className="relation-name">{BRIDE_TITLE}</span>
          </span>{" "}
          {BRIDE_FULLNAME}
        </div>

        <div className="break" />

        <Button
          onClick={() => {
            contactModalState[1](true)
          }}
        >
          연락하기
        </Button>
      </LazyDiv>

      {/* 연락처 정보 모달 */}
      <Modal
        modalState={contactModalState}
        className="contact-modal"
        closeOnClickBackground={true}
      >
        <div className="header">
          <div className="title-group">
            <div className="title">축하 인사 전하기</div>
            <div className="subtitle">
              전화, 문자메세지로 축하 인사를 전해보세요.
            </div>
          </div>
        </div>

        <div className="content">
          {/* 신랑측 연락처 */}
          <div className="contact-tabs">
            <button
              type="button"
              className={contactSide === "groom" ? "active" : ""}
              onClick={() => setContactSide("groom")}
            >
              <RiDiamondRingFill className="tab-icon groom" />
              신랑측
            </button>
            <button
              type="button"
              className={contactSide === "bride" ? "active" : ""}
              onClick={() => setContactSide("bride")}
            >
              <RiDiamondRingFill className="tab-icon bride" />
              신부측
            </button>
          </div>

          <div className="contact-info">
            {(contactSide === "groom" ? GROOM_INFO : BRIDE_INFO)
              .filter(({ phone }) => !!phone)
              .map(({ relation, name, phone }) => (
                <div className="contact-row" key={relation}>
                  <div className="contact-person">
                    <div className="relation">{relation}</div>
                    <div className="name">{name}</div>
                  </div>
                  <div className="contact-actions">
                    {/* 전화 걸기 */}
                    <button
                      type="button"
                      aria-label={`${name} 전화하기`}
                      onClick={() => {
                        window.open(`tel:${phone}`, "_self")
                      }}
                    >
                      <BiSolidPhoneCall className="icon" />
                    </button>
                    {/* 문자 보내기 */}
                    <button
                      type="button"
                      aria-label={`${name} 문자 보내기`}
                      onClick={() => {
                        window.open(`sms:${phone}`, "_self")
                      }}
                    >
                      <FaRegMessage className="icon" />
                    </button>
                  </div>
                </div>
              ))}
          </div>
          {/* 신부측 연락처 */}
        </div>
      </Modal>
    </>
  )
}
