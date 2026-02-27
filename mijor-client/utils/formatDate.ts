function formatMyDate(dateInput: string | undefined | null): string {
    if (!dateInput) return "";

    const [d, m, y] = dateInput.split('/');
    if (!d || !m || !y) return dateInput; // คืนค่าเดิมถ้า format ไม่ถูก

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthName = months[parseInt(m) - 1];

    return `${d} ${monthName} ${y}`;
}

export default formatMyDate;