"use client"

import { ArrowLeft, Image, Music } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"

export default function CreatePage() {
  const [selectedDifficulty, setSelectedDifficulty] = useState("beginner")

  const difficulties = [
    { id: "beginner", label: "#beginner" },
    { id: "easy", label: "#easy" },
    { id: "medium", label: "#medium" },
    { id: "hard", label: "#hard" },
  ]

  return (
    <div className="min-h-screen bg-white p-4">
      {/* Header */}
      <div className="mb-6 flex items-center gap-4">
        <Link href="/quizzes" className="text-gray-600">
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <h1 className="text-xl font-medium">create quiz</h1>
      </div>

      <div className="mx-auto max-w-3xl space-y-6">
        {/* Quiz Title */}
        <Input placeholder="title quiz" className="bg-gray-100 border-0" />

        {/* Difficulty */}
        <div className="space-y-2">
          <label className="text-sm">difficulty</label>
          <div className="flex flex-wrap gap-2">
            {difficulties.map((diff) => (
              <button
                key={diff.id}
                onClick={() => setSelectedDifficulty(diff.id)}
                className={`rounded-full px-4 py-1 text-sm ${
                  selectedDifficulty === diff.id ? "bg-blue-100 text-blue-600" : "bg-gray-100"
                }`}
              >
                {diff.label}
              </button>
            ))}
          </div>
        </div>

        {/* Question */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2>question 1</h2>
            <Button variant={'ghost'} className="text-red-500 hover:text-red-600 text-sm">Delete</Button>
          </div>

          <div className="relative">
            <div className="absolute left-4 top-4 flex gap-2 text-gray-400">
                
              <Music onClick={()=>alert('music')} className="h-5 w-5 hover:opacity-50" />
              <Image onClick={()=>alert('image')} className="h-5 w-5 hover:opacity-50" />
            </div>
            <Textarea placeholder="type question" className="min-h-[150px] bg-gray-100 border-0 pt-14" />
          </div>

          {/* Answers */}
          <div className="space-y-3">
            {[1, 2, 3, 4].map((num) => (
              <Input key={num} placeholder={`answer ${num}`} className="bg-gray-100 border-0" />
            ))}
          </div>
        </div>

        {/* Add Question Button */}
        <Button variant={'ghost'} className="text-blue-500 hover:text-blue-600">add new question</Button>

        {/* Complete Button */}
        <div className="pt-4 flex justify-end">
          <Button variant={'ghost'} className="text-green-500 hover:text-green-600">Complete</Button>
        </div>
      </div>
    </div>
  )
}

