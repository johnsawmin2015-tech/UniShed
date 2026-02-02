import { ClassSession } from "../domain/types";
import { minutesToTime, formatDuration } from "./timeUtils";

export const exportToCSV = (sessions: ClassSession[], filename: string) => {
    if (!sessions || sessions.length === 0) {
        alert("No data to export");
        return;
    }

    // Define headers
    const headers = ['Subject Code', 'Subject Name', 'Professor', 'Room', 'Day', 'Start Time', 'Duration', 'Section', 'Year'];

    // Map data to rows
    const rows = sessions.map(session => [
        session.subjectCode,
        session.subjectName,
        session.professor,
        session.room,
        session.day,
        minutesToTime(session.startMinutes),
        formatDuration(session.durationMinutes),
        session.section,
        session.year
    ]);

    // Combine headers and rows
    const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    // Create blob and download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');

    if (navigator.msSaveBlob) { // IE 10+
        navigator.msSaveBlob(blob, `${filename}.csv`);
    } else {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `${filename}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
};
