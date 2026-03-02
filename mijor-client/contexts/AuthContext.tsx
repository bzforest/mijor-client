import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/router";

interface User {
    id: string;
    email: string;
    name?: string;
}

interface AuthContextType {
    user: User | null;
    login: (userData: User , token: string , remember: boolean) => void;
    logout: () => void;
    isAuthLoading: boolean;
}

//  สร้าง context
const AuthContext = createContext< AuthContextType | null >(null)

// สร้าง provider
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user , setUser] = useState< User | null >(null);
    const [isAuthLoading , setIsAuthLoading] = useState(true) //  ไว้เช็คว่ากำลังเปิดตู้เซฟเพื่อเช็ค token อยู่มั้ย
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("access_token") || sessionStorage.getItem("access_token");
        const storedUser = localStorage.getItem("user") || sessionStorage.getItem("user");

        if (token && storedUser) {
            setUser(JSON.parse(storedUser)); // ถ้ามีของในตู้เซฟ ให้จับใส่ state
        }
        setIsAuthLoading(false); // เปิดตู้เซฟเสร็จแล้ว
    }, [])

    // function สำหรับ login แล้วรับข้อมูลมาเซฟลงตู้ และ อัปเดต state
    const login = (userData: User, token: string, remember: boolean) => {
        console.log("กำลังเซฟข้อมูล! Remember:", remember, "Token มีไหม?:", !!token);
        if (remember) {
            localStorage.setItem("access_token" , token);
            localStorage.setItem("user" , JSON.stringify(userData));
        } else {
            sessionStorage.setItem("access_token" , token);
            sessionStorage.setItem("user", JSON.stringify(userData));
        }
        setUser(userData);
        router.push("/")  // ล็อคอินเสร็จแล้ว ให้เด้งไปที่หน้า Home
    };

    // function สำหรับ logout
    const logout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");
        sessionStorage.removeItem("access_token");
        sessionStorage.removeItem("user");
        setUser(null);
        router.push("/login");  // logout แล้วเด้งไปหน้า login
    }

    return (
        <AuthContext.Provider value={{ user , login , logout , isAuthLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if ( !context ) {
        throw new Error("userAuth ต้องถูกใช้งานอยู่ภายใต้ AuthProvider เท่านั้น!");
    }
    return context
};