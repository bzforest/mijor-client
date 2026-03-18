import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";

interface User {
    id: string;
    email: string;
    name?: string;
}

interface AuthContextType {
    user: User | null;
    login: (userData: User , token: string , remember: boolean) => void;
    logout: () => void;
    updateUser: (userData: User) => void;
    updateSession: (userData: User, token: string) => void;
    isAuthLoading: boolean;
    navigateToLogin: () => void;
}

//  สร้าง context
const AuthContext = createContext< AuthContextType | null >(null)

// สร้าง provider
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user , setUser] = useState< User | null >(null);
    const [isAuthLoading , setIsAuthLoading] = useState(true) //  ไว้เช็คว่ากำลังเปิดตู้เซฟเพื่อเช็ค token อยู่มั้ย
    const router = useRouter();

    useEffect(() => {
        try {
            const token = localStorage.getItem("access_token") || sessionStorage.getItem("access_token");
            const storedUser = localStorage.getItem("user") || sessionStorage.getItem("user");

            if (token && storedUser) {
                setUser(JSON.parse(storedUser));
            }
        } catch (error) {
            console.error("เกิดข้อผิดพลาดในการอ่านข้อมูล User จาก Storage:", error);
            localStorage.removeItem("user");
            sessionStorage.removeItem("user");
        } finally {
            // ไม่ว่าจะสำเร็จหรือพัง ถือว่าเปิดตู้เซฟแล้ว
            setIsAuthLoading(false)
        }
    }, [])

    // สำหรับดักจับ token ที่หมดอายุ
    useEffect(() => {
        const interceptor = axios.interceptors.response.use(
            (response) => {
                return response
            },
            (error) => {
                // ถ้า API ตอบกลับมาเป็น Error 401 (Unauthorized) จาก Supabase หรือ Backend
                if (error.response && error.response.status === 401) {
                    console.error("Supabase บอกว่า Token หมดอายุ!");

                    // ล้างข้อมูลในตู้เซฟ
                    localStorage.removeItem("access_token");
                    localStorage.removeItem("user");
                    sessionStorage.removeItem("access_token");
                    sessionStorage.removeItem("user");

                    setUser(null);

                    // ส่งกลับไปที่หน้า Login พร้อมแนบ url ไปด้วย เพื่อที่ login เสร็จแล้ว จะได้กลับมาหน้าเดิม
                    const currentPath = router.asPath;
                    if (!currentPath.includes('/login')) {
                        router.push(`/login?returnTo=${encodeURIComponent(currentPath)}`);
                    }
                }
                return Promise.reject(error)
            }
        );
        // Clenup Function ป้องกันไม่ให้ inrerception ทำงานซ้อนกันหลายรอบ
        return () => {
            axios.interceptors.response.eject(interceptor);
        };
    }, [router, router.asPath]);

    const navigateToLogin = () => {
        const currentPath = router.asPath;
        // ป้องกันไม่ให้มันแนบ /login ซ้อนกันถ้าอยู่หน้า login อยู่แล้ว
        if (!currentPath.includes('/login')) {
            router.push(`/login?returnTo=${encodeURIComponent(currentPath)}`);
        } else {
            router.push('/login');
        }
    };

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
        const returnUrl = (router.query.returnTo as string) || "/";
        router.push(returnUrl);
    };

    // function สำหรับ logout
    const logout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");
        sessionStorage.removeItem("access_token");
        sessionStorage.removeItem("user");
        sessionStorage.removeItem("minor_chat_history");
        setUser(null);
        router.push("/login");  // logout แล้วเด้งไปหน้า login
    }

    // function สำหรับอัพเดทแค่ข้อมูล User (ไม่มีการ redirect)
    const updateUser = (userData: User) => {
        const isRemember = !!localStorage.getItem("access_token");
        if (isRemember) {
            localStorage.setItem("user", JSON.stringify(userData));
        } else {
            sessionStorage.setItem("user", JSON.stringify(userData));
        }
        setUser(userData);
    };

    // function สำหรับอัพเดททั้ง Token และ User (ไม่มีการ redirect)
    const updateSession = (userData: User, token: string) => {
        const isRemember = !!localStorage.getItem("access_token");
        if (isRemember) {
            localStorage.setItem("access_token", token);
            localStorage.setItem("user", JSON.stringify(userData));
        } else {
            sessionStorage.setItem("access_token", token);
            sessionStorage.setItem("user", JSON.stringify(userData));
        }
        setUser(userData);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, updateUser, updateSession, isAuthLoading, navigateToLogin }}>
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