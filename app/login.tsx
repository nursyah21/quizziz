"use client"
import { Button } from "@/components/ui/button"
import { authService } from "@/services/authService"
import { LoaderCircle } from "lucide-react"
import { useState } from "react"


export default function LoginPage() {
  const [isLoading, setisLoading] = useState(false)

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6">
      <h1 className="mb-16 text-3xl font-medium text-center">#japan quizziz</h1>

      <Button variant="ghost" onClick={async () => {
          setisLoading(true)
          authService.signInWithGooglePopUp()
          await new Promise(res=>setTimeout(res, 3000))
          setisLoading(false)
        }} className="flex items-center gap-2 px-6 py-5">
        {
          isLoading &&
          <LoaderCircle className="animate-spin" color="gray" />
        }
        <span>sign in with </span>
          <span className="text-blue-500">g</span>
          <span className="text-red-500">o</span>
          <span className="text-yellow-500">o</span>
          <span className="text-blue-500">g</span>
          <span className="text-green-500">l</span>
          <span className="text-red-500">e</span>
      </Button>
    </div>
  )
}

