/**
 * A function that takes the amount of seconds gone by since something and returns a formatted string how long it has been going on
 * @param stamp The amount of seconds gone by since the event
 * @returns a formatted string how long the event has been going on
 */
export function formatSeconds(seconds: number): string {
    const secsPerMin = 60;
    const secsPerHour = 60 * secsPerMin;
    const secsPerDay = 24 * secsPerHour;
    const secsPerMonth = 30 * secsPerDay;
    const secsPerYear = 365 * secsPerDay;

    const units = [
        { unit: secsPerYear, label: 'year' },
        { unit: secsPerMonth, label: 'month' },
        { unit: secsPerDay, label: 'day' },
        { unit: secsPerHour, label: 'hour' },
        { unit: secsPerMin, label: 'miniute' },
        { unit: 1, label: 'second' }
    ];

    let timeString = '';

    for (const unit of units) {
        const count = Math.floor(seconds / unit.unit);

        if (count > 0) {
            timeString += `${count} ${unit.label}${count > 1 ? 's' : ''} `;
            seconds %= unit.unit;
        }
    }


    return timeString.trim();
}