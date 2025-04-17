export function generateTimeslots() {
    const timeslots = [];
    for (let hour = 7; hour <= 18; hour++) {
        for (let minute = 0; minute < 60; minute += 60) {
            const time = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
            timeslots.push(time);
        }
    }
    return timeslots;
}