"use client";

/* ===== Imports ===== */
import { useState } from "react";
import MenuSidebar from "@/components/common/menuSidebar";
import Alert from "@/components/ui/Alert";
import { Eye, EyeOff } from "lucide-react";

/* ===== Component ===== */
export default function ResetPasswordPage() {

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState<"success" | "error">("success");
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");



  /* ===== Reset Logic ===== */
  const handleReset = async () => {

    const email = localStorage.getItem("email");
  
    if (!email) {
      setAlertType("error");
      setAlertTitle("Session error");
      setAlertMessage("Please login again");
      setShowAlert(true);
      return;
    }
  
    if (!currentPassword || !newPassword || !confirmPassword) return;
  
    if (newPassword !== confirmPassword) {
      setAlertType("error");
      setAlertTitle("Password mismatch");
      setAlertMessage("New password and confirm password do not match");
      setShowAlert(true);
      return;
    }
  
    try {
  
      const res = await fetch("http://localhost:4000/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: email,
          currentPassword: currentPassword,
          newPassword: newPassword
        })
      });
  
      const data = await res.json();

      if (!data.success) {

        setAlertType("error");
        setAlertTitle("Error");
        setAlertMessage(data.message);
        setShowAlert(true);

        return;
      }

      setAlertType("success");
      setAlertTitle("Password updated");
      setAlertMessage("Your password has been successfully reset");
      setShowAlert(true);

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

    } catch (err) {

      setAlertType("error");
      setAlertTitle("Server error");
      setAlertMessage("Something went wrong");
      setShowAlert(true);

    }

  };



  return (
    <div className="min-h-screen bg-[#0B1220] text-white">

      <div className="px-4 md:px-16 py-8 md:py-12">

        <div className="w-full lg:max-w-[1300px] lg:mx-auto lg:flex lg:gap-12 lg:items-start">

          <MenuSidebar />

          <div className="flex-1 max-w-[500px]">

            <h1 className="text-2xl md:text-3xl font-semibold mb-10">
              Reset password
            </h1>

            <div className="space-y-6">

              {/* Current Password */}
              <div>
                <label className="block text-sm mb-2 text-gray-400">
                  Current password
                </label>

                <div className="relative">

                  <input
                    type={showCurrent ? "text" : "password"}
                    placeholder="Current password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full bg-[#21263F] border border-[#565F7E] rounded-[4px] py-[12px] px-[16px] pr-[45px]"
                  />

                  <button
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>

                </div>
              </div>


              {/* New Password */}
              <div>
                <label className="block text-sm mb-2 text-gray-400">
                  New password
                </label>

                <div className="relative">

                  <input
                    type={showNew ? "text" : "password"}
                    placeholder="New password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-[#21263F] border border-[#565F7E] rounded-[4px] py-[12px] px-[16px] pr-[45px]"
                  />

                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>

                </div>
              </div>


              {/* Confirm Password */}
              <div>
                <label className="block text-sm mb-2 text-gray-400">
                  Confirm password
                </label>

                <div className="relative">

                  <input
                    type={showConfirm ? "text" : "password"}
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-[#21263F] border border-[#565F7E] rounded-[4px] py-[12px] px-[16px] pr-[45px]"
                  />

                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>

                </div>
              </div>


              {/* Reset Button */}
              <button
                onClick={handleReset}
                className="mt-4 px-6 py-2 border border-[#565F7E] rounded-[4px] hover:bg-[#21263F]"
              >
                Reset password
              </button>

            </div>

          </div>

        </div>
      </div>


      {/* Alert */}
      {showAlert && (
        <div className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-50 w-[90%] max-w-[420px]">

          <Alert
            type={alertType}
            title={alertTitle}
            message={alertMessage}
            onClose={() => setShowAlert(false)}
          />

        </div>
      )}

    </div>
  );
}