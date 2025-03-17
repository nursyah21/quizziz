"use client"

import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ChevronRight, X } from 'lucide-react'
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function QuizPage() {
    const [timeLeft, setTimeLeft] = useState(45)
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const router = useRouter()
    const params = useParams<{id:string}>()
    
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

    // FUNTCIONS
    const nextQuestion = () => { }

    return (
        <>
            <Header>
                <X className="hover:opacity-50 cursor-pointer" onClick={() => setIsDialogOpen(true)} />
                <h1 className="text-xl">quizziz</h1>
                <div className="text-xl">{formatTime(timeLeft)}</div>
            </Header>
            {params?.id}

            <div className="mx-auto max-w-3xl space-y-6 px-4">
                {/* Question Number */}
                <h2 className="">question 1</h2>

                {/* Question Content */}
                <div className="min-h-[200px] rounded-2xl bg-gray-100 p-6">
                    <p className="text-gray-500">Question</p>
                </div>

                {/* Answer Options */}
                <div className="space-y-3">
                    {["answer 1", "answer 2", "answer 3"].map((answer, index) => (
                        <button
                            key={index}
                            onClick={() => setSelectedAnswer(index)}
                            className={`w-full rounded-full bg-gray-100 px-6 py-3 text-left transition-colors ${selectedAnswer === index ? "bg-blue-100 text-blue-600" : "hover:bg-gray-200"
                                }`}
                        >
                            {answer}
                        </button>
                    ))}
                </div>

            </div>


            <div className="fixed bottom-4 right-4">
                <Button onClick={nextQuestion} disabled={selectedAnswer === null}>
                    <ChevronRight />
                </Button>
            </div>

            {/* Modal */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Exit Quiz</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to exit? Your progress will be lost.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                        <Button variant="destructive" onClick={() => {
                            setIsDialogOpen(false)
                            router.push('/')
                        }}>Exit</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}

