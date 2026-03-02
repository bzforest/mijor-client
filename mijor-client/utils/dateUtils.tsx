/**
 * ฟังก์ชันสำหรับจัดรูปแบบวันที่
 */

export const formatDate = (dateString: string): string => {
  if (!dateString) return "N/A";

  try {
    if (dateString.includes("T") || dateString.includes("-")) {
      const date = new Date(dateString);
      const day = date.getDate();
      const month = date.toLocaleDateString("en-US", { month: "short" });
      const year = date.getFullYear();

      return `${day} ${month} ${year}`;
    }

    // ถ้าเป็นรูปแบบอื่นให้ลอง parse แบบต่างๆ
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "Invalid Date";
    }

    const day = date.getDate();
    const month = date.toLocaleDateString("en-US", { month: "short" });
    const year = date.getFullYear();

    return `${day} ${month} ${year}`;
  } catch (error) {
    console.error("Date formatting error:", error, "Input:", dateString);
    return "Invalid Date";
  }
};
