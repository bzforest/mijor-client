"use client";

/* ===== Imports ===== */
import { useState, useRef, useEffect } from "react";
import MenuSidebar from "@/components/common/menuSidebar";
import Alert from "@/components/ui/Alert";
import { User } from "lucide-react";
import { supabase } from "@/utils/supabase";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useAuth } from "@/contexts/AuthContext";

/* ===== Component ===== */
export default function ProfilePage() {

  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { user, updateUser } = useAuth();

  /* ============================= */
  /* โหลดข้อมูลจาก Backend (avatars.ts) */
  /* ============================= */
  useEffect(() => {

    const loadProfile = async () => {
      try {
        setLoading(true);

        const token = localStorage.getItem("access_token") || sessionStorage.getItem("access_token");

        if (!token) {
          console.log("No token found");
          return;
        }

        // ดึงข้อมูลผ่าน Backend Server (avatars.ts) ครั้งเดียว
        const apiUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000").trim();
        const res = await axios.get(`${apiUrl}/api/avatars`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (res.data.success) {
          setName(res.data.name || "");
          setEmail(res.data.email || "");
          if (res.data.avatar_url) {
            setImagePreview(res.data.avatar_url);
          }
        }
      } catch (err: any) {
        console.error("Profile fetch error:", err);
        // ⭐ ถ้ากุญแจหมดอายุ (401) ให้สั่ง Logout หรือเด้งไปหน้า Login
        if (err.response?.status === 401) {
          alert("Session expired, please login again.");
          router.push("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    loadProfile();

  }, []);

  /* ============================= */
  /* กด upload */
  /* ============================= */
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  /* ============================= */
  /* เลือกไฟล์ */
  /* ============================= */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {

    const file = e.target.files?.[0];

    if (!file) return;

    const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];

    if (!allowedTypes.includes(file.type)) {
      alert("Only PNG or JPG allowed");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert("File must be less than 2MB");
      return;
    }

    setSelectedFile(file);

    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);

  };

  /* ============================= */
  /* Save profile ผ่าน Backend */
  /* ============================= */
  const handleSave = async () => {

    try {

      setLoading(true);

      const token = localStorage.getItem("access_token") || sessionStorage.getItem("access_token");
      const isRemember = !!localStorage.getItem("access_token");

      if (!token || !user) {
        alert("Session expired, please login again.");
        return;
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL;

      /* 1. อัปเดต Avatar (ถ้ามีการเลือกไฟล์) */
      if (selectedFile) {
        const formData = new FormData();
        formData.append("avatar", selectedFile);

        const avatarRes = await axios.post(
          `${apiUrl}/api/avatars`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        if (avatarRes.data.avatar_url) {
          setImagePreview(avatarRes.data.avatar_url);
        }
      }

      /* 2. อัปเดต Name ผ่าน Backend (avatars.ts หมวด PUT) */
      console.log("Saving name:", name);
      await axios.put(
        `${apiUrl}/api/avatars`,
        { name },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      // อัปเดตข้อมูลผู้ใช้ใน Context และ Storage (เพื่อให้ชื่อที่อื่นเปลี่ยนตาม)
      updateUser({ ...user, name: name });

      setShowAlert(true);

    } catch (err: any) {
      console.error("Save error detailed:", err.response?.data || err.message);
      alert(err.response?.data?.message || err.message || "Internal Server Error");
    } finally {
      setLoading(false);
    }

  };

  return (

    <div className="min-h-screen bg-[#0B1220] text-white">

      <div className="px-4 md:px-16 py-8 md:py-12">

        <div className="w-full lg:max-w-[1300px] lg:mx-auto lg:flex lg:gap-12 lg:items-start">

          <MenuSidebar />

          <div className="flex-1">

            <h1 className="text-2xl md:text-3xl font-semibold mb-8 md:mb-10">
              Profile
            </h1>

            <p className="text-gray-400 text-sm mb-10 max-w-xl">
              Keep your personal details private.
              <br />
              Information you add here is visible to anyone who can view your profile
            </p>




            {/* Avatar */}

            <div className="flex items-center gap-6 mb-10">

              <div className="w-28 h-28 rounded-full overflow-hidden bg-[#21263F] flex items-center justify-center">

                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User size={40} className="text-gray-400" />
                )}

              </div>

              <button
                onClick={handleUploadClick}
                className="mt-2 self-end text-sm text-gray-300 hover:text-white"
              >
                Upload
              </button>

              <input
                type="file"
                accept="image/png, image/jpeg"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
              />

            </div>

            {/* Form */}

            <div className="space-y-6 max-w-[380px]">

              <div>

                <label className="block text-sm mb-2 text-gray-400">
                  Name
                </label>

                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#21263F] border border-[#565F7E] rounded-[4px] py-[12px] px-[16px]"
                />

              </div>

              <div>

                <label className="block text-sm mb-2 text-gray-400">
                  Email
                </label>

                <input
                  type="email"
                  value={email}
                  disabled
                  className="w-full bg-[#21263F] border border-[#565F7E] rounded-[4px] py-[12px] px-[16px] text-gray-400"
                />

              </div>

              <button
                onClick={handleSave}
                disabled={loading}
                className="mt-2 px-6 py-2 border border-[#565F7E] rounded-[4px] hover:bg-[#21263F]"
              >

                {loading ? "Saving..." : "Save"}

              </button>

            </div>

          </div>

        </div>

      </div>

      {/* Alert */}

      {showAlert && (
        <div className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-50 w-[90%] max-w-[420px]">

          <Alert
            type="success"
            title="Saved profile"
            message="Your profile has been successfully updated"
            onClose={() => setShowAlert(false)}
          />

        </div>
      )}

    </div>

  );

}