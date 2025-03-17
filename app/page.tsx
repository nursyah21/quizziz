"use client"

import { Header } from "@/components/header"
import { InfiniteScroll } from "@/components/infinityScroll"
import { algoliaConfig } from "@/lib/algoliaConfig"
import { Quiz } from "@/lib/schema"
import { formatTime } from "@/lib/utils"
import { quizService } from "@/services/quizService"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import { Hits, InstantSearch, SearchBox } from "react-instantsearch"
import { Avatar } from "../components/avatar"

export default function HomePage() {
  const [listQuiz, setListQuiz] = useState<Quiz[] | null>([])
  const [totalQuiz, setTotalQuiz] = useState<number | null>(null)
  const params = useSearchParams()
  const searchParams = params.get('search')

  const canLoadMore = useCallback(() => {
    let result = true
    if (totalQuiz == null || listQuiz == null) result = false;
    else if (listQuiz.length == totalQuiz) result = false;
    return result
  }, [totalQuiz, listQuiz])

  const loadMoreQuizzes = useCallback(async () => {
    if (!canLoadMore()) return
    const moreQuizzes = searchParams ?
      await quizService.listQuiz({ size: 5, search: searchParams })
      :
      await quizService.listQuiz({ size: 5 })

    if (moreQuizzes?.length) {
      setListQuiz(prev => prev ? [...prev, ...moreQuizzes] : moreQuizzes)
    }
  }, [canLoadMore])

  const getTotalQuizzes = useCallback(async () => {
    if (totalQuiz) return;
    setTotalQuiz(searchParams ? await quizService.totalQuiz({ search: searchParams }) : await quizService.totalQuiz());
  }, [totalQuiz]);

  useEffect(() => {
    getTotalQuizzes()
    loadMoreQuizzes()
  }, [listQuiz, totalQuiz, loadMoreQuizzes, getTotalQuizzes])

  return (
    <>
      <Header >
        <div className="flex items-center gap-3">
          <Avatar />
          <h1 className="text-xl hidden sm:block ">quizziz</h1>
        </div>
        <div className="flex-1">
          
          {/* <Form className="flex gap-x-2" action={'/'} >
            <SearchAction />
          </Form> */}
        </div>
      </Header>

      <InstantSearch indexName="quizzez" searchClient={algoliaConfig}>
            <SearchBox />
            <Hits />
          </InstantSearch>

      {/* Quiz List */}
      <div className="p-4 py-0">
        <div className="mx-auto max-w-3xl  space-y-6">
          {
            listQuiz?.map((quiz, index) => (
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


