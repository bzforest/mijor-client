function formatMyDate(dateInput: string): string {
    const [d, m, y] = dateInput.split('/');
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const monthName = months[parseInt(m) - 1];

    return `${d} ${monthName} ${y}`;
}

export default formatMyDate;