import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import CustomBreadCrumb from "components/CustomBreadCrumb";

import { Button } from "primereact/button";
import { getApprovedJobRequest } from "redux/jobRequest/selector";
import { getCandidates } from "redux/candidate/selector";
import { createInterview } from "redux/interview/actionCreator";
import { getAllUsers } from "redux/user/selector";
import { KHONG_TON_TAI, ROUND_INTERVIEW } from "constants/app";
import genElementsForm from "utils/genElementsForm";
import formatTime from "utils/formatTime"

const items = [{ label: "Lịch phỏng vấn" }, { label: "Tạo lịch phỏng vấn" }];

const FormInsertInterview = (props) => {
	const dispatch = useDispatch();
	const history = useHistory();
	const location = useLocation();
	const {
		control,
		watch,
		formState: { errors },
		reset,
		handleSubmit,
	} = useForm();
	const [loading, setLoading] = useState(false);

	const job = watch("job_id");

	const users = useSelector(getAllUsers);
	const approvedJobRequest = useSelector(getApprovedJobRequest);
	const candidates = useSelector(getCandidates);
	let candidateFilter = [];

	if(job) candidateFilter = candidates.filter(candidate => candidate.job_id === job.id);

	const fields = [
		{ label: "Tiêu đề", name: "title", type: "inputText" },
		{ label: "Ngày phỏng vấn", name: "date", type: "calender", autoFocus: true, },
		{ label: "Người phỏng vấn", name: "receiver", type: "select", options: users, optionLabel: "name", },
		{ label: "Thời gian bắt đầu", name: "time_end", type: "calender", showTime: true, timeOnly: true, isMindata: false, customClass: "p-field p-col-12 p-md-3" },
		{ label: "Thời gian kết thúc", name: "time_end", type: "calender", showTime: true, timeOnly: true, isMindata: false, customClass: "p-field p-col-12 p-md-3" },
		{ label: "Địa điểm", name: "location", type: "inputText" },
		{ label: "Vòng phỏng vấn", name: "round_no", type: "dropdown", options: ROUND_INTERVIEW, optionLabel: "title", },
		{ label: "Yêu cầu tuyển dụng", name: "job_id", type: "dropdown", options: approvedJobRequest, optionLabel: "title", },
		{ label: "Ứng viên", name: "name_candidate", type: "select", options: candidateFilter, optionLabel: "name", },
	];

	const formRender = genElementsForm(fields, control, errors);

	const onSubmit = (data) => {
		try {
			const date = formatTime.formatShortsDate(data.date) ;

			setLoading(true);

			dispatch(
				createInterview(
					{
						...data,
						time_start: date + " " + formatTime.formatHour(data.time_start),
						time_end: date + " " + formatTime.formatHour(data.time_end),
						date: undefined,
						job_id: data.job_id?.id,
						receiver: data.receiver
							.map((item) => item.id)
							.join(","),
						name_candidate: data.name_candidate
							.map((item) => item.id)
							.join(","),
						totalReceiver: data.receiver
							.map((item) => item.id)
							.join(",")
							.split(",").length,
					},
					() => history.push("/admin/interview")
				)
			);
		} catch (error) {
			return error;
		}
	};

	useEffect(() => {
		if(location.state) {
			const data = location.state;
			const date = data?.time_start.split(" ")[0];
			const job = approvedJobRequest.find(item => item?.id === data.job_id);
			const receiver = users.filter(user => data.receiver_id.indexOf(String(user.id)) !== KHONG_TON_TAI);
			const candidate = candidates.filter(cadi => cadi.id === data?.name_candidate?.id);

			reset({
				title: data?.title,
				location: data?.location,
				date: new Date(Date.parse(date)),
				time_start: new Date(Date.parse(data?.time_start)),
				time_end: new Date(Date.parse(data?.time_end)),
				round_no: data.round_no,
				job_id: job,
				receiver: receiver,
				name_candidate: candidate
			});
		}
	}, [location.state])

	return (
		<>
			<CustomBreadCrumb items={items} />
			<div className="card">
				<form onSubmit={handleSubmit(onSubmit)}>
					<div className="p-fluid p-formgrid p-grid">
						{formRender}
					</div>
					<Button
						loading={loading}
						type="submit"
						label="Thêm lịch phỏng vấn"
					/>
				</form>
			</div>
		</>
	);
};

export default FormInsertInterview;
