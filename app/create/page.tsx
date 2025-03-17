"use client"

import { Header } from "@/components/header"
import { Loading } from "@/components/loading"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Question, Quiz } from "@/lib/schema"
import { useAuthStore } from "@/lib/store"
import { questionService } from "@/services/questionService"
import { quizService } from "@/services/quizService"
import { storageService } from "@/services/storageService"
import { Timestamp } from "firebase/firestore"
import { ArrowLeft, Check, Image as ImageIcon, Music, Plus } from "lucide-react"
import Image from 'next/image'
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useRef, useState } from "react"
import { toast } from "sonner"

export default function CreatePage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedDifficulty, setSelectedDifficulty] = useState("beginner")
  const [quizId, setQuizId] = useState<string | null>("")
  const [quizTitle, setQuizTitle] = useState("")
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: '', question: "", answers: ["", "", ""], type: "text",
      correct: ""
    },
  ])
  const [loading, setLoading] = useState(false)

  const fileMusicRef = useRef<HTMLInputElement | null>(null)
  const fileImageRef = useRef<HTMLInputElement | null>(null)

  const difficulties = [
    { id: "beginner", label: "#beginner" },
    { id: "easy", label: "#easy" },
    { id: "medium", label: "#medium" },
    { id: "hard", label: "#hard" },
  ]

  const router = useRouter()

  const user = useAuthStore.getState().user

  // FUNCTIONS

  const handleQuestionChange = (index: number, value: string) => {
    const newQuestions = [...questions]
    newQuestions[index].question = value
    setQuestions(newQuestions)
  }

  const handleAnswerChange = (qIndex: number, aIndex: number, value: string) => {
    const newQuestions = [...questions]
    newQuestions[qIndex].answers[aIndex] = value
    setQuestions(newQuestions)
  }

  const addNewQuestion = () => {
    if (questions.length >= 50) {
      toast.error('max question is 50')
      return
    }
    setQuestions([...questions, { id: "", question: "", answers: ["", "", ""], type: "text", correct: "" }])
  }

  const deleteQuestion = async (index: number) => {
    if (questions.length <= 1) {
      toast.error('at least have 1 question')
      return
    }

    if(questions[index].id && quizId){
      setLoading(true)
      await questionService.deleteQuestion(quizId, questions[index].id)
      setLoading(false)
    }
    const newQuestions = questions.filter((_, qIndex) => qIndex !== index)
    setQuestions(newQuestions)
  }

  const saveQuestion = async (index: number) => {
    if (!quizId) {
      toast.error('you must save title and difficulty before create question')
      return
    }

    // Validate each question and its answers
    for (const [qIndex, q] of questions.entries()) {
      if (!q.question.trim()) {
        toast.error(`Question ${qIndex + 1} cannot be empty`);
        return;
      }
      if (!q.correct.trim()) {
        toast.error(`Correct Question ${qIndex + 1} cannot be empty`);
        return;
      }

      if (q.question.trim().length >= 300) {
        toast.error(`max length question is 300 character`);
        return;
      }


      for (const [aIndex, answer] of q.answers.entries()) {
        if (!answer.trim()) {
          toast.error(`Answer ${aIndex + 1} for question ${qIndex + 1} cannot be empty`);
          return;
        }
        if (answer.trim().length >= 100) {
          toast.error(`max length answer is 100 character`);
          return;
        }
      }
    }


    setLoading(true)
    let message = "save question"
    if (questions[index].id) {
      await questionService.updateQuestion(quizId!, questions[index])
      message = "update question"
    } else {
      const res = await questionService.createQuestion(quizId!, questions[index])
      questions[index].id = res
    }

    toast.success(message)
    setLoading(false)
  }

  const uploadFile = async (type: 'music' | 'image', qIndex: number) => {
    const fileInputRef = type === 'music' ? fileMusicRef : fileImageRef
    const file = fileInputRef.current?.files?.[0]
    if (!file) {
      toast.error('No file selected')
      return
    }

    if (file.size > 1024 * 1024) {
      toast.error('File size exceeds 1MB')
      return
    }

    setLoading(true)
    try {
      const path = `${type}/${file.name}`
      const downloadURL = await storageService.uploadFile(file, path)
      if (!downloadURL) {
        throw new Error();
      }
      const newQuestions = [...questions]
      newQuestions[qIndex].question = downloadURL
      newQuestions[qIndex].type = type === 'music' ? 'audio' : 'image'
      setQuestions(newQuestions)
    } catch (error) {
      console.error(error)
      toast.error('Error uploading file')
    } finally {
      setLoading(false)
    }

  }

  const saveTitle = async () => {
    if (!quizTitle) {
      toast.error('title cant be empty')
      return
    }
    if (quizTitle.length >= 100) {
      toast.error('max length is 100 character')
      return
    }

    const data: Quiz = {
      title: quizTitle,
      usercreator: user?.uid ?? "",
      difficulty: selectedDifficulty,
      timestamp: Timestamp.now(),
      draft: true,
      numberOfQuestion: 1
    }

    setLoading(true)
    let result = quizId
    let message = ""
    if (!quizId) {
      result = await quizService.addQuiz(data)
      setQuizId(result)
      message = result ? "save title and difficulty success" : "fail to save title and difficulty"
    } else {
      await quizService.updateQuiz(quizId, {
        title: quizTitle, difficulty: selectedDifficulty, timestamp: Timestamp.now()
      })
      message = "update title and difficulty success"
    }
    setLoading(false)
    toast.error(message)
  }

  const publishQuiz = async () => {
    if (!quizId) {
      toast.error('you must save title and difficulty')
      return
    }
    if (!questions[0].id) {
      toast.error('you must atleast have 1 question')
      return
    }
    setIsDialogOpen(false)
    setLoading(true)
    await quizService.publishQuiz(quizId!)
    setLoading(false)
    router.push('/')
  }


  return (
    <>
      <Header>
        <div className="flex items-center gap-4">
          <Link href={"/"}>
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <h1 className="text-xl font-medium">create quiz</h1>
        </div>

        <div className="flex justify-end">
          <Button onClick={() => setIsDialogOpen(true)} variant={'ghost'} >
            <Check className="h-6 w-6" />
          </Button>
        </div>
      </Header>

      <Loading show={loading} />
      <div className="min-h-screen bg-white p-4 py-0 mb-12">
        <div className="mx-auto max-w-3xl space-y-6">
          {/* Quiz Title */}
          <label className="text-sm">title</label>
          <Input
            placeholder="title quiz"
            className="bg-gray-100 border-0"
            value={quizTitle}
            onChange={(e) => setQuizTitle(e.target.value)}
          />

          {/* Difficulty */}
          <div className="space-y-2">
            <label className="text-sm">difficulty</label>
            <div className="flex flex-wrap gap-2">
              {difficulties.map((diff) => (
                <button
                  key={diff.id}
                  onClick={() => setSelectedDifficulty(diff.id)}
                  className={`rounded-full px-4 py-1 text-sm ${selectedDifficulty === diff.id ? "bg-blue-100 text-blue-600" : "bg-gray-100"
                    }`}
                >
                  {diff.label}
                </button>
              ))}
            </div>
          </div>

          <Button variant={'ghost'} onClick={saveTitle} className="w-full">{quizId ? "Update" : "Save"} title and difficulty</Button>

          <hr />

          {/* Questions */}
          {questions.map((q, qIndex) => (
            <div key={qIndex} className="space-y-4">
              <Collapsible defaultOpen>
                <>
                  <div className="flex items-center justify-between">
                    <CollapsibleTrigger className="flex gap-x-2">
                      <h2>question {qIndex + 1}</h2>
                    </CollapsibleTrigger>
                    <div>
                      <Button
                        variant={'ghost'}
                        className="text-green-500 hover:text-green-600 text-sm"
                        onClick={() => saveQuestion(qIndex)}
                      >
                        {q.id ? 'Update' : 'Save'}
                      </Button>
                      <Button
                        variant={'ghost'}
                        className="text-red-500 hover:text-red-600 text-sm"
                        onClick={() => deleteQuestion(qIndex)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </>
                <CollapsibleContent>
                  <div className="relative">
                    {q.type === 'image' ? (
                      <div className="flex justify-center items-center">
                        <Image src={q.question} alt="Uploaded" className="w-auto h-[300px] text-center" />
                      </div>
                    ) : q.type === 'audio' ? (
                      <audio controls className="w-full">
                        <source src={q.question} type="audio/mpeg" />
                        Your browser does not support the audio element.
                      </audio>
                    ) : (
                      <>
                        <div className="absolute left-4 top-4 flex gap-2 text-gray-400">
                          <input ref={fileMusicRef} type="file" accept="audio/*" className="hidden" onChange={() => uploadFile('music', qIndex)} />
                          <Music onClick={() => fileMusicRef.current?.click()} className="h-5 w-5 hover:opacity-50" />

                          <input ref={fileImageRef} type="file" accept="image/*" className="hidden" onChange={() => uploadFile('image', qIndex)} />
                          <ImageIcon onClick={() => fileImageRef.current?.click()} className="h-5 w-5 hover:opacity-50" />
                        </div>
                        <Textarea
                          disabled={loading}
                          placeholder="type question"
                          className="min-h-[150px] bg-gray-100 border-0 pt-14"
                          value={q.question}
                          onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
                        />
                      </>
                    )}
                  </div>

                  {/* Answers */}
                  <div className="space-y-3 mt-3">
                    {q.answers.map((answer, aIndex) => (
                      <div
                        key={aIndex}
                        className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={q.correct === answer && answer != ''}
                          onChange={() => {
                            const newQuestions = [...questions];
                            newQuestions[qIndex].correct = newQuestions[qIndex].answers[aIndex];
                            setQuestions(newQuestions);
                          }}
                        />
                        <Input
                          placeholder={`answer ${aIndex + 1}`}
                          className="bg-gray-100 border-0"
                          value={answer}
                          onChange={(e) => handleAnswerChange(qIndex, aIndex, e.target.value)}
                        />
                      </div>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>


            </div>
          ))}


          <div className="fixed bottom-4 right-4">
            <Button onClick={addNewQuestion}>
              <Plus />
            </Button>
          </div>

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
                <Button variant="outline" className="text-green-500 hover:text-green-600" onClick={publishQuiz}>Yes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </>
  )
}