"use client"

import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ArrowLeft, Search } from "lucide-react"
import Link from "next/link"
import router from "next/router"
import { useState } from "react"

export default function CreatePage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

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