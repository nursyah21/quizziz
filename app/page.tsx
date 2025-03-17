"use client"

import { useAuth } from "@/components/auth"
import { Header } from "@/components/header"
import { InfiniteScroll } from "@/components/infinityScroll"
import { Quiz } from "@/lib/schema"
import { useAuthStore } from "@/lib/store"
import { formatTime } from "@/lib/utils"
import { quizService } from "@/services/quizService"
import { Search } from "lucide-react"
import Link from "next/link"
import { useCallback, useEffect, useState } from "react"
import { Avatar } from "../components/avatar"
import LoginPage from "./login"



export default function HomePage() {
  const { user, loading } = useAuth()
  const [listQuiz, setListQuiz] = useState<Quiz[] | null>([])
  const [totalQuiz, setTotalQuiz] = useState<number | null>(null)
  
  const canLoadMore = useCallback(() => {
    let result = true
    if (totalQuiz == null || listQuiz == null) result = false;
    else if (listQuiz.length == totalQuiz) result = false;
    return result
  },[totalQuiz, listQuiz])

  const loadMoreQuizzes = useCallback(async () => {
    if (!canLoadMore()) return
    const moreQuizzes = await quizService.listQuiz(5)
    if (moreQuizzes?.length) {
      setListQuiz(prev => prev ? [...prev, ...moreQuizzes] : moreQuizzes)
    }
  }, [canLoadMore])

  const getTotalQuizzes = useCallback(async () => {
    if (totalQuiz) return;
    setTotalQuiz(await quizService.totalQuiz());
  }, [totalQuiz]);

  useEffect(() => {
    if (!user) return
    
    getTotalQuizzes()
    
    loadMoreQuizzes()
  }, [user, listQuiz, totalQuiz, loadMoreQuizzes, getTotalQuizzes])

  if (loading) {
    return <></>
  }

  if (!user) {
    return <LoginPage />
  } else {
    useAuthStore.getState().setUser(user)
  }


  return (
    <>
      <Header >
        <div className="flex items-center gap-3">
          <Avatar />
          <h1 className="text-xl">quizziz</h1>
        </div>
        <button className="p-2">
          <Search className="h-5 w-5" />
        </button>
      </Header>

      {/* Quiz List */}
      <div className="p-4 py-0">
        <div className="mx-auto max-w-3xl  space-y-6">
          {listQuiz?.map((quiz, index) => (
            <div key={index} className="space-y-1">
              <Link href={`/quiz/${quiz.id}`}>
                <h2 className="text-lg">{quiz.title}</h2>
              </Link>
              <p className="text-sm text-muted-foreground">{quiz.numberOfQuestion} question • {quiz.difficulty}</p>
              <p className="text-sm text-muted-foreground">{formatTime(quiz.timestamp)}</p>
            </div>
          ))}
        </div>
      <div className="text-muted-foreground text-center text-sm my-4">
          {
            canLoadMore() && "Please wait..."
          } 
      </div>
      </div>
      
      <InfiniteScroll onEnd={loadMoreQuizzes} />
      
    </>
  )
}


