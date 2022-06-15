import * as moment from "moment";

export const modifyTimeAccordingTimezone = (dateTime: string, timezone: string): string => {
    if (!timezone || timezone.length !== 6 || !["+", "-"].includes(timezone[0]) || timezone[3] !== ':') {
        return moment(dateTime).format('DD.MM.YYYY HH:mm:ss');
    }

    const operation = timezone[0];

    const [hours, minutes] = timezone.slice(1, 6).split(':');

    const convertedHours = parseInt(hours);

    const convertedMinutes = parseInt(minutes);

    let convertedDateTime = moment(dateTime);

    if (operation === '+') {
        convertedDateTime = convertedDateTime
            .add(convertedHours, 'hour')
            .add(convertedMinutes, 'minute');
    }

    if (operation === '-') {
        convertedDateTime = convertedDateTime
            .subtract(convertedHours, 'hour')
            .subtract(convertedMinutes, 'minute');
    }

    return convertedDateTime.format('DD.MM.YYYY HH:mm:ss');
}