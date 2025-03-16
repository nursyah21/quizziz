"use client"
import { LoaderCircle } from "lucide-react";

export const Loading = ({ show }: { show: boolean }) => show ? (
    <>
        <div className="fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,.5)] z-50">
            <LoaderCircle className="animate-spin" color="blue" />
        </div>
    </>
) : <></>