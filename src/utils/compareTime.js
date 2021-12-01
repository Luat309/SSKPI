import moment from "moment";

export const compareTimeFromTo = (timeCompare, timeFrom, timeTo) => {
	return (
		moment(timeCompare).isAfter(timeFrom) &&
		moment(timeCompare).isBefore(timeTo)
	);
};
