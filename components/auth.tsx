"use client"

import LoginPage from "@/app/login";
import NotFound from "@/app/not-found";
import { auth } from "@/lib/firebase";
import { useAuthStore } from "@/lib/store";
import { onAuthStateChanged, User } from "firebase/auth";
import { usePathname } from "next/navigation";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

type AuthContextType = {
    user: User | null,
    loading: boolean
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true
});

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const pathname = usePathname()

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user)
            setLoading(false)
        })
        return () => unsubscribe()
    }, [])

    if(loading){
        return <></>
    }



    if (!user) {
        if (pathname != '/') return <NotFound />
        return <LoginPage />
    } else {
        useAuthStore.getState().setUser(user)
    }

    return <AuthContext.Provider value={{ user, loading }}>
        {children}
    </AuthContext.Provider>
}

export function useAuth() {
    return useContext(AuthContext)
}