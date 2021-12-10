import CustomBreadCrumb from "components/CustomBreadCrumb";
import { Button } from "primereact/button";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router";
import { editCandidate } from "redux/candidate/action";
import { getJobRequest } from "redux/jobRequest/selector";
import "./style.scss";

const items = [{ label: "Ứng viên" }, { label: " Sửa ứng viên" }];
const CandidateEdit = () => {
	const { id } = useParams();
	const history = useHistory();
	const dispatch = useDispatch();
	const { cadidate } = useSelector((state) => state.cadidate);
	const [detailId, setdetailId] = useState();

	const data = useSelector(getJobRequest);

	const {
		register,
		formState: { errors },
		handleSubmit,
		reset,
	} = useForm();

	useEffect(() => {
		const data = cadidate.find((item) => item.id === Number(id));
		setdetailId(data);
		reset({ ...data, image: null, cv: null });
	}, [cadidate, id, reset]);

	let formData = new FormData();

	const onHandleSubmit = (data) => {
		if (data.cv !== null) {
			formData.append("cv", data.cv[0]);
		}
		if (data.image !== null) {
			formData.append("image", data.image[0]);
		}
		formData.append("name", data.name);
		formData.append("phone", data.phone);
		formData.append("source", data.source);
		formData.append("experience", data.experience);
		formData.append("email", data.email);
		formData.append("school", data.school);
		formData.append("job_id", data.job_id);
		formData.append("status", data.status);
		dispatch(editCandidate(id, formData));
		setTimeout(() => {
			history.push("/admin/candidate");
		}, 2000);
	};
	return (
		<>
			<CustomBreadCrumb items={items} />
			<div className="card">
				<form onSubmit={handleSubmit(onHandleSubmit)}>
					<div className="gird">
						<div className="candidate_left">
							<div>
								<label htmlFor="name">Họ và tên*</label>
								<br />
								<input
									type="text"
									{...register("name", { required: true })}
									defaultValue={detailId?.name}
								/>
								{errors.name && (
									<span
										style={{
											color: "red",
											marginBottom: "7px",
										}}
									>
										Bắt buộc phải nhập.
									</span>
								)}
							</div>
							<div style={{ marginTop: "40px" }}>
								<label htmlFor="phone">Số điện thoại*</label>
								<br />
								<input
									type="text"
									{...register("phone", { required: true })}
									defaultValue={detailId?.phone}
								/>
								{errors.phone && (
									<span
										style={{
											color: "red",
											marginBottom: "7px",
										}}
									>
										Bắt buộc phải nhập.
									</span>
								)}
							</div>
							<div style={{ marginTop: "20px" }}>
								<label htmlFor="experience">Kinh nghiệm*</label>
								<br />
								<input
									type="number"
									min={0}
									{...register("experience", {
										required: true,
										min: 1,
										max: 99,
									})}
									defaultValue={detailId?.experience}
								/>
								{errors.experience && (
									<span
										style={{
											color: "red",
											marginBottom: "7px",
										}}
									>
										Bắt buộc phải nhập.
									</span>
								)}
							</div>
							<div style={{ marginTop: "15px" }}>
								<label htmlFor="school">Trường*</label>
								<br />
								<input
									type="text"
									{...register("school", { required: true })}
									defaultValue={detailId?.school}
								/>
								{errors.school && (
									<span
										style={{
											color: "red",
											marginBottom: "7px",
										}}
									>
										Bắt buộc phải nhập.
									</span>
								)}
							</div>
							<div style={{ marginTop: "15px" }}>
								<label htmlFor="lastname6">Thêm ảnh*</label>
								<br />
								<input
									type="file"
									{...register("image", { required: false })}
								/>
								<img
									src={`http://34.124.182.156/storage/images/candidate/${detailId?.image}`}
									alt=""
									width="150px"
								/>
							</div>
						</div>
						<div className="candidate_right">
							<div>
								<label htmlFor="lastname6">CV*</label>
								<br />
								<input type="file" {...register("cv")} />
								{errors.cv && (
									<span
										style={{
											color: "red",
											marginBottom: "7px",
										}}
									>
										Bắt buộc phải nhập.
									</span>
								)}
								<br />
								<a
									href={detailId?.cv}
									target="_blank"
									rel="noreferrer"
								>
									Đường dẫn file CV
								</a>
							</div>
							<br />
							<div>
								<label htmlFor="lastname6">Email*</label>
								<br />
								<input
									type="text"
									value={detailId?.email}
									{...register("email", { required: true })}
								/>
								{errors.email && (
									<span
										style={{
											color: "red",
											marginBottom: "7px",
										}}
									>
										Bắt buộc phải nhập.
									</span>
								)}
							</div>
							<div style={{ margin: "20px 0" }}>
								<label htmlFor="status">Trạng thái*</label>
								<br />
								<select
									defaultValue={detailId?.status}
									{...register("status", { required: true })}
								>
									<option value="Vòng CV">Vòng CV</option>
									<option value="CV pass vòng 1 (hr)">
										CV pass vòng 1 (hr)
									</option>
									<option value="CV pass vòng 2 (TBP)">
										CV pass vòng 2 (TBP)
									</option>
									<option value="Sắp xếp PV">
										Sắp xếp PV
									</option>
									<option value="PV Pass">PV Pass</option>
									<option value="PV Faild">PV Faild</option>
								</select>
								{errors.phone && (
									<span
										style={{
											color: "red",
											marginBottom: "7px",
										}}
									>
										Bắt buộc phải nhập.
									</span>
								)}
							</div>
							<div>
								<label htmlFor="source">Nguồn*</label>
								<br />
								<select
									name=""
									id=""
									{...register("source", { required: true })}
									defaultValue={detailId?.source}
								>
									<option value="Vnws">Vnws</option>
									<option value="Top CV">Top CV</option>
									<option value="Tìm việc nhanh">
										Tìm việc nhanh
									</option>
									<option value="IT việc">IT việc</option>
									<option value="University campaign">
										University campaign
									</option>
									<option value="Network">Network</option>
								</select>
								{errors.phone && (
									<span
										style={{
											color: "red",
											marginBottom: "7px",
										}}
									>
										Bắt buộc phải nhập.
									</span>
								)}
							</div>
							<div style={{ margin: "20px 0" }}>
								<label>Dự án*</label>
								<br />
								<select
									name=""
									id=""
									{...register("job_id", { required: true })}
									defaultValue={detailId?.job_id}
								>
									{data.map
										? data.map((item) => {
												return (
													<option value={item.id}>
														{item.title}
													</option>
												);
										  })
										: ""}
								</select>
								{errors.phone && (
									<span
										style={{
											color: "red",
											marginBottom: "7px",
										}}
									>
										Bắt buộc phải nhập.
									</span>
								)}
							</div>
						</div>
					</div>
					<center>
						<Button label="Sửa ứng viên" type="submit" />
					</center>
				</form>
			</div>
		</>
	);
};

export default CandidateEdit;
