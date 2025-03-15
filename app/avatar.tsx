"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { useAuthStore } from "@/lib/store"
import { AuthService } from "@/services/authService"
import { useRouter } from "next/navigation"

export function Avatar() {
  const user = useAuthStore.getState().user
  const router = useRouter()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-white cursor-default">{user?.displayName?.charAt(0).toUpperCase()}</div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>{user?.displayName}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={()=>router.push('/create')}>
          Create Quiz
        </DropdownMenuItem>
        <DropdownMenuSeparator /> 
        <DropdownMenuItem onClick={AuthService.logout}>
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
