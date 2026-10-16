import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Button } from "../button"
import { dayjs } from "../../const"
import { LazyDiv } from "../lazyDiv"
import { Modal } from "../modal"
import { supabase } from "../../lib/supabase"

/**
 * 방명록 입력 규칙 설정
 */
const RULES = {
  name: {
    maxLength: 10,
  },
  content: {
    maxLength: 100,
  },
  password: {
    minLength: 4,
    maxLength: 20,
  },
}

const PAGES_PER_BLOCK = 5
const POSTS_PER_PAGE = 5

/**
 * 방명록 게시물 타입 정의
 */
type Post = {
  id: number
  timestamp: number
  name: string
  content: string
}

/**
 * 방명록 섹션 컴포넌트입니다.
 * 최근 게시물을 표시하고, 작성/전체보기/삭제 기능을 제공합니다.
 *
 * @returns {JSX.Element} 방명록 섹션
 */
export const GuestBook = () => {
  const [posts, setPosts] = useState<Post[]>([])
  const [totalCount, setTotalCount] = useState(0)

  // 모달 상태 관리
  const guestbookListModalState = useState(false)
  const deleteGuestBookModalState = useState(false)
  const [deletePostId, setDeletePostId] = useState<number | null>(null)

  /**
   * 서버 또는 로컬 파일에서 방명록 게시물을 불러옵니다.
   */
  const loadPosts = async () => {
    const { data, error, count } = await supabase
      .from("guestbook")
      .select("id, name, message, created_at", { count: "exact" })
      .order("created_at", { ascending: false })
      .limit(3)

    if (error) {
      console.error(error)
      return
    }

    setPosts(
      data.map((item) => ({
        id: item.id,
        name: item.name,
        content: item.message,
        timestamp: dayjs(item.created_at).unix(),
      })),
    )
    setTotalCount(count ?? 0)
  }

  useEffect(() => {
    loadPosts()
  }, [])

  return (
    <>
      <LazyDiv className="card guestbook">
        <h2 className="english">Guest Book</h2>
        <p style={{ textAlign: "center", color: "#777", fontSize: 14 }}>
          지금까지 {totalCount}개의 축하 메시지가 도착했어요.
        </p>

        <div className="break" />

        {/* 게시물 목록 표시 */}
        <div className="guestbook-write-inline">
          <WriteGuestBookModal loadPosts={loadPosts} />
        </div>

        <div className="break" />

        {posts.map((post) => (
          <div key={post.id} className="post">
            <div className="heading">
              {/*
              <button
                className="close-button"
                onClick={async () => {
                  if (false) {
                    setDeletePostId(post.id)
                    deleteGuestBookModalState[1](true)
                  }
                }}
              />
              */}
            </div>
            <div className="body">
              <div className="title">
                <div className="name">{post.name}</div>
                <div className="date">
                  {dayjs.unix(post.timestamp).format("YYYY-MM-DD")}
                </div>
              </div>
              <div className="content">{post.content}</div>
            </div>
          </div>
        ))}

        <div className="break" />

        <Button onClick={() => guestbookListModalState[1](true)}>
          방명록 전체보기
        </Button>
      </LazyDiv>

      {/* 방명록 전체보기 모달 */}
      <Modal
        modalState={guestbookListModalState}
        className="guestbook-list-modal"
        closeOnClickBackground={true}
      >
        <GuestBookListModal loadPosts={loadPosts} />
      </Modal>

      {/* 방명록 삭제 모달 */}
      <Modal
        modalState={deleteGuestBookModalState}
        className="delete-guestbook-modal"
        closeOnClickBackground={false}
      >
        <DeleteGuestBookModal
          postId={deletePostId}
          onSuccess={() => {
            deleteGuestBookModalState[1](false)
            loadPosts()
          }}
          onCancel={() => {
            deleteGuestBookModalState[1](false)
          }}
        />
      </Modal>

      {/* 방명록 작성 모달 */}
    </>
  )
}

/**
 * 방명록 작성을 위한 모달 컴포넌트입니다.
 */
const WriteGuestBookModal = ({
  loadPosts,
  onClose,
}: {
  loadPosts: () => void
  onClose?: () => void
}) => {
  const inputRef = useRef({}) as React.RefObject<{
    name: HTMLInputElement
    content: HTMLTextAreaElement
    password: HTMLInputElement
  }>
  const [loading, setLoading] = useState(false)

  return (
    <form
      className="form"
      onSubmit={async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
          const name = inputRef.current.name.value.trim()
          const content = inputRef.current.content.value.trim()
          const password = inputRef.current.password.value

          // 유효성 검사
          if (!name) {
            alert("이름을 입력해주세요.")
            return
          }
          if (name.length > RULES.name.maxLength) {
            alert(`이름을 ${RULES.name.maxLength}자 이하로 입력해주세요.`)
            return
          }

          if (!content) {
            alert("내용을 입력해주세요.")
            return
          }
          if (content.length > RULES.content.maxLength) {
            alert(`내용을 ${RULES.content.maxLength}자 이하로 입력해주세요.`)
            return
          }

          if (password.length < RULES.password.minLength) {
            alert(`비밀번호를 ${RULES.password.minLength}자 이상 입력해주세요.`)
            return
          }

          // 서버에 데이터 전송
          const { error } = await supabase.from("guestbook").insert({
            name,
            message: content,
            password,
          })

          if (error) {
            throw error
          }

          alert("방명록 작성이 완료되었습니다.")
          inputRef.current.name.value = ""
          inputRef.current.content.value = ""
          inputRef.current.password.value = ""
          onClose?.()
          loadPosts()
        } catch (error) {
          console.error("방명록 작성 실패:", error)
          alert("방명록 작성에 실패했습니다.")
        } finally {
          setLoading(false)
        }
      }}
    >
      <div className="header">
        <div className="title-group">
          <div className="title">방명록 작성하기</div>
          <div className="subtitle">
            신랑, 신부에게 축하의 마음을 전해주세요.
          </div>
        </div>
      </div>
      <div className="content">
        <div className="inline-fields">
          <label>
            이름
            <input
              disabled={loading}
              type="text"
              placeholder="이름"
              ref={(ref) => {
                inputRef.current.name = ref as HTMLInputElement
              }}
              maxLength={RULES.name.maxLength}
            />
          </label>
          <label>
            비밀번호
            <input
              disabled={loading}
              type="password"
              placeholder="비밀번호"
              ref={(ref) => {
                inputRef.current.password = ref as HTMLInputElement
              }}
              maxLength={RULES.password.maxLength}
            />
          </label>
        </div>
        <label>
          내용
          <textarea
            disabled={loading}
            placeholder="축하 메세지를 100자 이내로 입력해주세요."
            ref={(ref) => {
              inputRef.current.content = ref as HTMLTextAreaElement
            }}
            maxLength={RULES.content.maxLength}
          />
        </label>
      </div>
      <div className="footer">
        <Button buttonStyle="style2" disabled={loading} type="submit">
          저장하기
        </Button>
        {onClose && (
          <Button
            buttonStyle="style2"
            type="button"
            className="bg-light-grey-color text-dark-color"
            onClick={onClose}
          >
            닫기
          </Button>
        )}
      </div>
    </form>
  )
}

/**
 * 방명록 목록을 페이지네이션과 함께 표시하는 모달 컴포넌트입니다.
 */
const GuestBookListModal = ({
  loadPosts,
}: {
  loadPosts: () => Promise<void>
}) => {
  const [posts, setPosts] = useState<Post[]>([])
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(1)

  const deleteGuestBookModalState = useState(false)
  const [deletePostId, setDeletePostId] = useState<number | null>(null)

  /**
   * 특정 페이지의 데이터를 로드합니다.
   *
   * @param {number} page - 불러올 페이지 번호
   */
  const loadPage = useCallback(async (page: number) => {
    setCurrentPage(page)

    const from = page * POSTS_PER_PAGE
    const to = from + POSTS_PER_PAGE - 1

    const { data, error, count } = await supabase
      .from("guestbook")
      .select("id, name, message, created_at", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(from, to)

    if (error) {
      console.error("방명록 전체보기 실패:", error)
      return
    }

    const totalPages = Math.ceil((count ?? 0) / POSTS_PER_PAGE)

    if (page !== 0 && page >= totalPages) {
      loadPage(totalPages - 1)
      return
    }

    setPosts(
      data.map((item) => ({
        id: item.id,
        name: item.name,
        content: item.message,
        timestamp: Math.floor(new Date(item.created_at).getTime() / 1000),
      })),
    )

    setTotalPages(totalPages || 1)
  }, [])

  useEffect(() => {
    loadPage(0)
  }, [loadPage])

  // 표시할 페이지 번호 계산
  const pages = useMemo(() => {
    const start = Math.floor(currentPage / PAGES_PER_BLOCK) * PAGES_PER_BLOCK
    const end = Math.min(start + PAGES_PER_BLOCK, totalPages)
    return Array.from({ length: end - start }).map((_, index) => index + start)
  }, [currentPage, totalPages])

  return (
    <>
      <div className="header">
        <div className="title">방명록 전체보기</div>
      </div>
      <div className="content">
        {posts.map((post) => (
          <div key={post.id} className="post">
            <div className="heading">
              {/*
              <div                className="close-button"
                onClick={async () => {
                  if (false) {
                    setDeletePostId(post.id)
                    deleteGuestBookModalState[1](true)
                  }
                }}
              />
              */}
            </div>
            <div className="body">
              <div className="title">
                <div className="name">{post.name}</div>
                <div className="date">
                  {dayjs.unix(post.timestamp).format("YYYY-MM-DD")}
                </div>
              </div>
              <div className="content">{post.content}</div>
            </div>
          </div>
        ))}

        <div className="break" />

        {/* 페이지네이션 컨트롤 */}
        <div className="pagination">
          {pages[0] > 0 && (
            <div className="page" onClick={() => loadPage(pages[0] - 1)}>
              이전
            </div>
          )}
          {pages.map((page) => (
            <div
              className={`page${page === currentPage ? " current" : ""}`}
              key={page}
              onClick={() => {
                if (page === currentPage) return
                loadPage(page)
              }}
            >
              {page + 1}
            </div>
          ))}
          {pages[pages.length - 1] < totalPages - 1 && (
            <div
              className="page"
              onClick={() => loadPage(pages[pages.length - 1] + 1)}
            >
              다음
            </div>
          )}
        </div>
      </div>
      <Modal
        modalState={deleteGuestBookModalState}
        className="delete-guestbook-modal"
        closeOnClickBackground={false}
      >
        <DeleteGuestBookModal
          postId={deletePostId}
          onSuccess={() => {
            deleteGuestBookModalState[1](false)
            loadPosts()
            loadPage(currentPage)
          }}
          onCancel={() => {
            deleteGuestBookModalState[1](false)
          }}
        />
      </Modal>
    </>
  )
}

/**
 * 방명록 삭제를 위해 비밀번호를 입력받는 모달 컴포넌트입니다.
 */
const DeleteGuestBookModal = ({
  postId,
  onSuccess,
  onCancel,
}: {
  postId: number | null
  onSuccess: () => void
  onCancel: () => void
}) => {
  const inputRef = useRef({} as HTMLInputElement)
  const [loading, setLoading] = useState(false)

  if (postId === null) return null

  return (
    <form
      className="form"
      onSubmit={async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
          const password = inputRef.current.value
          if (!password || password.length < RULES.password.minLength) {
            alert(`비밀번호를 ${RULES.password.minLength}자 이상 입력해주세요.`)
            return
          }

          // 서버에 삭제 요청 전송
          const result = await fetch(`${SERVER_URL}/guestbook`, {
            method: "PUT", // 서버 설계에 따라 DELETE 대신 PUT으로 비밀번호 확인을 포함한 삭제를 처리할 수 있음
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: postId, password }),
          })

          if (!result.ok) {
            if (result.status === 403) {
              alert("비밀번호가 일치하지 않습니다.")
            } else {
              alert("방명록 삭제에 실패했습니다.")
            }
            return
          }

          alert("삭제되었습니다.")
          onSuccess()
        } catch {
          alert("방명록 삭제에 실패했습니다.")
        } finally {
          setLoading(false)
        }
      }}
    >
      <div className="header">
        <div className="title">삭제하시겠습니까?</div>
      </div>
      <div className="content">
        <input
          disabled={loading}
          type="password"
          placeholder="비밀번호를 입력해주세요."
          ref={inputRef}
          maxLength={RULES.password.maxLength}
        />
      </div>
      <div className="footer">
        <Button buttonStyle="style2" disabled={loading} type="submit">
          삭제하기
        </Button>
        <Button
          buttonStyle="style2"
          type="button"
          className="bg-light-grey-color text-dark-color"
          onClick={onCancel}
        >
          닫기
        </Button>
      </div>
    </form>
  )
}
