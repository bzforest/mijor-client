"use client";

/* ===== Imports ===== */
import { useState, useRef, useEffect } from "react";
import MenuSidebar from "@/components/common/menuSidebar";
import Alert from "@/components/ui/Alert";
import { User } from "lucide-react";
import { supabase } from "@/utils/supabase";
import { useRouter } from "next/navigation";

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

  /* ============================= */
  /* โหลด user + avatar */
  /* ============================= */
  useEffect(() => {

    const loadUser = async () => {

      const { data } = await supabase.auth.getSession();

      const session = data.session;

      if (!session) return;

      const user = session.user;

      setEmail(user.email || "");

      const { data: profile } = await supabase
        .from("profiles")
        .select("name, avatar_url")
        .eq("id", user.id)
        .single();

      if (profile) {

        setName(profile.name || "");

        if (profile.avatar_url) {
          setImagePreview(profile.avatar_url + "?t=" + Date.now());
        }

      }

    };

    loadUser();

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
  /* Save profile */
  /* ============================= */
  const handleSave = async () => {

    try {

      setLoading(true);

      const { data } = await supabase.auth.getSession();

      const session = data.session;

      if (!session) {
        alert("Session expired");
        return;
      }

      const user = session.user;

      let uploadedImageUrl = imagePreview || "";

      /* ============================= */
      /* Upload avatar */
      /* ============================= */

      if (selectedFile) {

        const fileExt = selectedFile.name.split(".").pop();

        const filePath = `${user.id}/avatar.${fileExt}`;

        const { error } = await supabase.storage
          .from("avatars")
          .upload(filePath, selectedFile, {
            upsert: true
          });

        if (error) {

          console.log(error);
          alert("Upload failed");
          return;

        }

        const { data: publicUrl } = supabase.storage
          .from("avatars")
          .getPublicUrl(filePath);

        uploadedImageUrl = publicUrl.publicUrl + "?t=" + Date.now();

        setImagePreview(uploadedImageUrl);

      }

      /* ============================= */
      /* update auth metadata */
      /* ============================= */

      await supabase.auth.updateUser({
        data: {
          name: name,
          avatar_url: uploadedImageUrl
        }
      });

      /* ============================= */
      /* update profiles table */
      /* ============================= */

      await supabase
        .from("profiles")
        .update({
          name: name,
          avatar_url: uploadedImageUrl
        })
        .eq("id", user.id);

      setShowAlert(true);

      

    } catch (err) {

      console.log(err);
      alert("Something went wrong");

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