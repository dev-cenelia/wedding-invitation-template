import { useState } from "react"
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io"
import { BRIDE_INFO, GROOM_INFO } from "../../const"
import { STATIC_ONLY } from "../../env"
import { Button } from "../button"
import { LazyDiv } from "../lazyDiv"
import { AttendanceInfo } from "./attendance"

type AccountSide = "groom" | "bride"

/**
 * 축의금 계좌번호 안내 컴포넌트입니다.
 * 신랑측, 신부측 계좌번호를 모달로 보여줍니다.
 */
export const Information2 = () => {
  const [openAccount, setOpenAccount] = useState<AccountSide | null>(null)

  const copyAccount = async (account: string) => {
    try {
      await navigator.clipboard.writeText(account)
      alert(account + "\n복사되었습니다.")
    } catch {
      alert("복사에 실패했습니다.")
    }
  }

  const renderAccountPanel = (
    side: AccountSide,
    title: string,
    accounts: typeof GROOM_INFO,
  ) => {
    const isOpen = openAccount === side

    return (
      <div className={`account-accordion${isOpen ? " open" : ""}`}>
        <button
          type="button"
          className="account-accordion-trigger"
          onClick={() => setOpenAccount(isOpen ? null : side)}
        >
          <span>{title}</span>
          <span className="account-accordion-arrow">
            {isOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}
          </span>
        </button>
        <div className="account-accordion-content">
          {accounts
            .filter(({ account }) => !!account)
            .map(({ relation, name, account }) => (
              <div className="account-info" key={relation}>
                <div className="account-detail">
                  <div className="name">
                    <span className="relation">{relation}</span> {name}
                  </div>
                  <div className="account-number">{account}</div>
                </div>
                <Button
                  className="copy-button"
                  onClick={() => {
                    if (account) {
                      copyAccount(account)
                    }
                  }}
                >
                  복사하기
                </Button>
              </div>
            ))}
        </div>
      </div>
    )
  }

  return (
    <>
      <h2 className="english">Account</h2>
      <div className="info-card">
        <div className="account-title">마음을 전하는 곳</div>
        <div className="content account-description">
          참석이 어려워 직접 축하해주지 못하는
          <br />
          분들을 위해 계좌번호를 기재하였습니다.
          <br />
          넓은 마음으로 양해 부탁드립니다.
        </div>

        <div className="break" />

        <div className="account-accordion-list">
          {renderAccountPanel("groom", "신랑측 계좌번호", GROOM_INFO)}
          {renderAccountPanel("bride", "신부측 계좌번호", BRIDE_INFO)}
        </div>
      </div>
    </>
  )
}

/**
 * 정보 안내(식사, 축의금, 참석의사)를 통합하여 표시하는 컴포넌트입니다.
 *
 * @returns {JSX.Element} 정보 안내 섹션
 */
export const Information = () => {
  // 정적 모드일 경우 참석 의사 전달 기능을 제외합니다.
  if (STATIC_ONLY) {
    return (
      <LazyDiv className="information">
        <Information2 />
      </LazyDiv>
    )
  }

  return (
    <LazyDiv className="information">
      <Information2 />
      <AttendanceInfo />
    </LazyDiv>
  )
}
