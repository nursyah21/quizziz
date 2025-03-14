"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {ChevronLeft} from 'lucide-react'

export default function QuizPage() {
  const [timeLeft, setTimeLeft] = useState(30)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)

  useEffect(() => {
    if (timeLeft <= 0) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft])

  const formatTime = (seconds: number) => {
    return `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`
  }

  return (
    <div className="min-h-screen bg-white p-4">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <ChevronLeft onClick={()=>alert('back')} className="hover:opacity-50" />
        <h1 className="text-xl">quizziz</h1>
        <div className="text-xl">{formatTime(timeLeft)}</div>
      </div>

      <div className="mx-auto max-w-3xl space-y-6">
        {/* Question Number */}
        <h2 className="">question 1</h2>

        {/* Question Content */}
        <div className="min-h-[200px] rounded-2xl bg-gray-100 p-6">
          <p className="text-gray-500">Question</p>
        </div>

        {/* Answer Options */}
        <div className="space-y-3">
          {["answer 1", "answer 2", "answer 3", "answer 4"].map((answer, index) => (
            <button
              key={index}
              onClick={() => setSelectedAnswer(index)}
              className={`w-full rounded-full bg-gray-100 px-6 py-3 text-left transition-colors ${
                selectedAnswer === index ? "bg-blue-100 text-blue-600" : "hover:bg-gray-200"
              }`}
            >
              {answer}
            </button>
          ))}
        </div>

        {/* Next Button */}
        <div className="flex justify-end pt-4">
          <Button variant={'ghost'} className="w-full text-green-500 hover:text-green-600" disabled={selectedAnswer === null}>
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}

