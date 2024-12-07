export function formatDate(date: Date | string): string {
    const formattedDate = new Date(date);
    return formattedDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}