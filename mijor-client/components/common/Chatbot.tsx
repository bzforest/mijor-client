import { useState } from "react";
import axios from "axios";

type Message = {
    role: "user" | "bot"
    text: string;
}

export default function Chatbot () {

    const [isOpen , setIsOpen] = useState(false);
    const [inputText , setInputText] = useState("");
    const [message , setMessage] = useState<Message[]>([
        { role: "bot" , text: "สนใจอยากดูหนังเรื่องอะไรดีครับ ?" }
    ])
    const [isLoading , setIsLoading] = useState(false);
    const [isError , setIsError] = useState(false);

    const handleSendMessage = async () => {
        if (!inputText.trim()) return;

        //เอาข้อความใหม่ไปต่อแชทเดิม
        const userText = inputText;
        const newMessage: Message[] = [
            ...message,
            { role: "user" , text: inputText }
        ];
        setMessage(newMessage);
        setInputText("");

        setIsLoading(true);
        setIsError(false);

            try {
                const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
                const response = await axios.post(`${API_URL}/chatbot` , {
                    message: userText
                })

                setMessage((prev) => [
                    ...prev,
                    { role: "bot" , text: response.data.text }
                ]);
                
            } catch (error) {
                console.error("Chat API Error" , error);
                setMessage((prev) => [
                    ...prev,
                    { role: "bot" , text: "ขออภัยครับ ตอนนี้ระบบขัดข้อง 😢"}
                ]);
                setIsError(true);
            } finally {
                // ปิดสถานะโหลด ไม่ว่าจะสำเร็จหรือพัง
                setIsLoading(false);
            }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            
            {isOpen && (
                <div className="w-[350px] h-[500px] bg-brand-gray-0 rounded-2xl shadow-2xl mb-4 flex flex-col overflow-hidden border border-brand-gray-300">

                    {/* Header */}
                    <div className="bg-linear-to-b from-brand-blue-300 to-brand-blue-100 p-4 text-white font-bold flex justify-between items-center">
                        <span>Minor AI Assistant</span>
                        <button onClick={() => setIsOpen(false)} className="hover:text-brand-gray-200 transition-colors">
                            X
                        </button>
                    </div>

                    {/* Body */}
                    <div className="flex-1 p-4 overflow-y-auto bg-brand-gray-0">
                        {message.map((msg , index) => (
                            <div 
                                key={index}
                                className={`flex mb-6 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                            >
                                <div className={`max-w-[80%] rounded-lg px-4 py-2 text-sm whitespace-pre-wrap ${
                                    msg.role === "user"
                                    ? "bg-brand-blue-300 text-white rounded-br-none"
                                    : "bg-brand-gray-200 text-white rounded-bl-none"
                                }`}>
                                    {msg.text}
                                </div>   
                            </div>
                        ))}

                        {isLoading && (
                            <div className="flex justify-start mt-2">
                                    <div className="w-2 h-2 bg-brand-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                                    <div className="w-2 h-2 bg-brand-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                                    <div className="w-2 h-2 bg-brand-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                            </div>
                        )}
                    </div>

                    {/* Input */}
                    <div className="p-3 border-t border-brand-gray-300 flex gap-2">
                        <input 
                            type="text"
                            placeholder="พิมพ์ข้อความที่นี่..."
                            className="flex-1 bg-background border border-brand-gray-300 text-brand-gray-0 rounded-lg px-3 py-2 focus:outline-none focus:border-brand-blue-300"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                        />
                        <button className="bg-linear-to-t from-brand-blue-300 to-brand-blue-200 text-white px-4 py-2 rounded-lg font-bold hover:opacity-80 transition-opacity"
                                onClick={handleSendMessage}>
                            Send
                        </button>
                    </div>

                </div>
            )}
{/* Floating Button */}
<button
                onClick={() => setIsOpen(!isOpen)}
                className="w-[150px] h-[150px] flex items-center justify-center hover:scale-110 transition-transform p-1 overflow-hidden cursor-pointer"
            >
                <img 
                    src={
                        isLoading ? "/images/chatbot/chat08.png" :  // ถ้ากำลังคิด
                        isError ? "/images/chatbot/chat05.png" :    // ถ้าขัดข้อง
                        isOpen ? "/images/chatbot/chat03.png" :     // ถ้าเปิดแชทอยู่
                        "/images/chatbot/chat01.png"                // สถานะปกติ
                    }
                    alt="Chatbot Mascot"
                    // เพิ่ม transition ให้รูปค่อยๆ เฟดเปลี่ยนหน้า จะเนียนมากครับ
                    className="w-full h-full object-contain transition-all duration-300"
                />
            </button>

        </div>
    );
}