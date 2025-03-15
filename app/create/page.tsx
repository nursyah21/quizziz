"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { StorageService } from "@/services/storageService"
import { ArrowLeft, Image, Music, LoaderCircle } from "lucide-react"
import Link from "next/link"
import router from "next/router"
import { useRef, useState } from "react"
import { toast } from "sonner"

export default function CreatePage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedDifficulty, setSelectedDifficulty] = useState("beginner")
  const [quizTitle, setQuizTitle] = useState("")
  const [questions, setQuestions] = useState([
    { id: 1, question: "", answers: ["", "", "", ""], type: "text" },
  ])
  const [uploading, setUploading] = useState(false)

  const fileMusicRef = useRef<HTMLInputElement | null>(null)
  const fileImageRef = useRef<HTMLInputElement | null>(null)

  const difficulties = [
    { id: "beginner", label: "#beginner" },
    { id: "easy", label: "#easy" },
    { id: "medium", label: "#medium" },
    { id: "hard", label: "#hard" },
  ]

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
    setQuestions([...questions, { id: questions.length + 1, question: "", answers: ["", "", "", ""], type: "text" }])
  }

  const deleteQuestion = (index: number) => {
    const newQuestions = questions.filter((_, qIndex) => qIndex !== index)
    setQuestions(newQuestions)
  }

  const saveQuestion = () => {

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

    setUploading(true)
    try {
      const path = `${type}/${file.name}`
      const downloadURL = await StorageService.uploadFile(file, path)
      const newQuestions = [...questions]
      newQuestions[qIndex].question = downloadURL
      newQuestions[qIndex].type = type === 'music' ? 'audio' : 'image'
      setQuestions(newQuestions)
    } catch (error) {
      toast.error('Error uploading file')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white p-4">
      {/* Header */}
      <div className="mb-6 flex items-center gap-4">
        <Link href={"/"}>
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <h1 className="text-xl font-medium">create quiz</h1>
      </div>

      <div className="mx-auto max-w-3xl space-y-6">
        {/* Quiz Title */}
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

        {/* Questions */}
        {questions.map((q, qIndex) => (
          <div key={q.id} className="space-y-4">
            <div className="flex items-center justify-between">
              <h2>question {qIndex + 1}</h2>
              <Button
                variant={'ghost'}
                className="text-red-500 hover:text-red-600 text-sm"
                onClick={() => deleteQuestion(qIndex)}
              >
                Delete
              </Button>
            </div>

            <div className="relative">

              {
                uploading &&
                <div className="absolute bottom-4 right-4">
                  <LoaderCircle className="animate-spin" />
                </div>
              }
              {q.type === 'image' ? (
                <div className="flex justify-center items-center">
                  <img src={q.question} alt="Uploaded" className="w-auto h-[300px] text-center" />
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
                    <Image onClick={() => fileImageRef.current?.click()} className="h-5 w-5 hover:opacity-50" />
                  </div>
                  <Textarea
                    disabled={uploading}
                    placeholder="type question"
                    className="min-h-[150px] bg-gray-100 border-0 pt-14"
                    value={q.question}
                    onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
                  />
                </>
              )}
            </div>

            {/* Answers */}
            <div className="space-y-3">
              {q.answers.map((answer, aIndex) => (
                <Input
                  key={aIndex}
                  placeholder={`answer ${aIndex + 1}`}
                  className="bg-gray-100 border-0"
                  value={answer}
                  onChange={(e) => handleAnswerChange(qIndex, aIndex, e.target.value)}
                />
              ))}
            </div>
          </div>
        ))}

        {/* Add Question Button */}
        <Button variant={'ghost'} className="text-blue-500 hover:text-blue-600" onClick={addNewQuestion}>
          add new question
        </Button>
        <Button variant={'ghost'} className="text-green-500 hover:text-green-600" onClick={addNewQuestion}>
          save question
        </Button>

        {/* Complete Button */}
        <div className="pt-4 flex justify-end">
          <Button onClick={() => setIsDialogOpen(true)} variant={'ghost'} className="text-green-500 hover:text-green-600">
            Complete
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
              <Button variant="outline" className="text-green-500 hover:text-green-600" onClick={() => {
                setIsDialogOpen(false)
                router.push('/')
              }}>Yes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}