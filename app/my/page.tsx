"use client"

import { Header } from "@/components/header"
import { InfiniteScroll } from "@/components/infinityScroll"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Quiz } from "@/lib/schema"
import { formatTime } from "@/lib/utils"
import { quizService } from "@/services/quizService"
import { ArrowLeft, Search } from "lucide-react"
import Link from "next/link"
import router from "next/router"
import { useCallback, useEffect, useState } from "react"

export default function CreatePage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [listQuiz, setListQuiz] = useState<Quiz[] | null>([])
  const [totalQuiz, setTotalQuiz] = useState<number | null>(null)

  const canLoadMore = useCallback(() => {
    let result = true
    if (totalQuiz == null || listQuiz == null) result = false;
    else if (listQuiz.length == totalQuiz) result = false;
    return result
  }, [totalQuiz, listQuiz])

  const loadMoreQuizzes = useCallback(async () => {
    if (!canLoadMore()) return
    const moreQuizzes = await quizService.listQuiz({size: 5, isOwn: true})
    if (moreQuizzes?.length) {
      setListQuiz(prev => prev ? [...prev, ...moreQuizzes] : moreQuizzes)
    }
  }, [canLoadMore])

  const getTotalQuizzes = useCallback(async () => {
    if (totalQuiz) return;
    setTotalQuiz(await quizService.totalQuiz({isOwn: true}));
  }, [totalQuiz]);

  useEffect(() => {
    getTotalQuizzes()

    loadMoreQuizzes()
  }, [ listQuiz, totalQuiz, loadMoreQuizzes, getTotalQuizzes])

  return (
    <>
      <Header>
        <div className="flex items-center gap-4">
          <Link href={"/"}>
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <h1 className="text-xl font-medium">my quiz</h1>
        </div>

        <button className="p-2">
          <Search className="h-5 w-5" />
        </button>
      </Header>

      <div className="min-h-screen bg-white p-4 py-0">
        <div className="mx-auto max-w-3xl space-y-6">

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

          {/* Modal */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirm Complete</DialogTitle>
                <DialogDescription>
                  Are you sure you want to complete?
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button variant="outline" className="text-green-500 hover:text-green-600" onClick={() => {
                  setIsDialogOpen(false)
                  router.push('/')
                }}>Yes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </>
  )
}