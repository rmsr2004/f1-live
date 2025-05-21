export function getISOStringFromDateTimePT(date: string, time: string): string {
    const dateTime = new Date(`${date}T${time}`);
    const utcDate = new Date(
        dateTime.toLocaleString('en-US', { timeZone: 'Europe/Lisbon' })
    );
    return utcDate.toISOString();
}

export function formatDateTime(date: string, time: string): string {
    const dt = new Date(`${date}T${time}`);
    const formatter = new Intl.DateTimeFormat('en-EN', {
        weekday: 'short',
        day: '2-digit',
        month: 'long',
        timeZone: 'Europe/Lisbon',
    });
    const weekdayDayMonth = formatter.format(dt).replace('.', '').replace(/^./, c => c.toUpperCase());
    const hourMinute = dt.toLocaleTimeString('pt-PT', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Europe/Lisbon',
    });
    return `${weekdayDayMonth} - ${hourMinute}`;
}

export function formatDateRange(startDateStr: string, endDateStr: string): string {
    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);

    const dayStart = startDate.getDate();
    const dayEnd = endDate.getDate();

    const month = startDate.toLocaleString('en-EN', { month: 'long' });
    const year = startDate.getFullYear();

    return `${dayStart}-${dayEnd} ${capitalize(month)} ${year}`;
}

export function capitalize(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
