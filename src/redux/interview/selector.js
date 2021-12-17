import formatTime from "utils/formatTime";

export const getInterviews = (state) => {
	const jobRequest = {};
	const user = {};

	if (Array.isArray(state?.jobRequest?.data)) {
		state?.jobRequest?.data.forEach((item) => {
			jobRequest[item.id] = item;
		});
	};

	if(Array.isArray(state?.user?.data)) {
		state?.user?.data.forEach((item) => {
			user[item.id] = item;
		});
	}

	return state.interview.data.map((item) => {
		const data = formatTime.formatShortDate(item.time_start.split(" ")[0]);
		const time_start = item.time_start.split(" ")[1];
		const time_end = item.time_end.split(" ")[1];

		return {
			...item,
			job_name: jobRequest[item.job_id]?.title,
			time_interview: data + " - [" + time_start + " - " + time_end + "]",
			candidate_name: item?.name_candidate?.name,
			receiver: item?.receiver.map(re => user[re]?.name).join(", "),
			receiver_id: item?.receiver
		};
	});
};
export const getStatusInterview = (state) => state.interview.status;
