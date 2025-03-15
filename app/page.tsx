"use client"

import { Search } from "lucide-react"
import { Avatar } from "../components/avatar"
import { useAuth } from "@/components/auth"
import LoginPage from "./login"
import { useAuthStore } from "@/lib/store"

export default function HomePage() {
  const {user, loading} = useAuth()


  if (loading){
    return <></>
  }

  if (!user) {
    return <LoginPage/>
  }else {
    useAuthStore.getState().setUser(user)
  }
  
  return (
    <>
      {/* Header */}
      <header className="flex items-center justify-between border-b p-4">
        <div className="flex items-center gap-3">
          <Avatar />
          <h1 className="text-xl">quizziz</h1>
        </div>
        <button className="p-2">
          <Search className="h-5 w-5" />
        </button>
      </header>

      {/* Quiz List */}
      <div className="p-4">
        <div className="mx-auto max-w-3xl  space-y-6">
          {/* Quiz Card 1 */}
          <div className="space-y-1">
            <h2 className="text-lg">do you know japan</h2>
            <p className="text-sm text-muted-foreground">10 question • beginner</p>
            <p className="text-sm text-muted-foreground">3 hours ago</p>
          </div>

          {/* Quiz Card 2 */}
          <div className="space-y-1">
            <h2 className="text-lg">traveling in japan</h2>
            <p className="text-sm text-muted-foreground">10 question • beginner</p>
            <p className="text-sm text-muted-foreground">3 hours ago</p>
          </div>
        </div>
      </div>
    </>
  )
}

