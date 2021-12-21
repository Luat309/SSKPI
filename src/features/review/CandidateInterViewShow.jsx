import CustomBreadCrumb from "components/CustomBreadCrumb";
import CustomDataTable from "components/CustomDataTable";
import moment from "moment";
import { Column } from "primereact/column";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import "moment/locale/vi";
import { getCandidateInterviews } from "redux/candidateInterview/selector";
import { Dialog } from "primereact/dialog";
import CandidateDetail from "./CandidateDetail";
import { useHistory } from "react-router";
import PermissionButton from "components/PermissionButton";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getCandidateInterview } from "redux/candidateInterview/action";

const items = [{ label: "Đánh Giá Ứng viên" }, { label: " Đánh giá" }];
const CandidateInterViewShow = () => {
	moment.locale("vi");
	const [isOpen, setIsOpen] = useState(false);
	const [valueDetail, setValueDetail] = useState();
	const history = useHistory();
	const candidateInterview = useSelector(getCandidateInterviews);
	const { user } = JSON.parse(localStorage.getItem("currentUser"));
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(getCandidateInterview());
	}, []);
	const timeBodyTemplate = (rowData) => {
		return (
			<p>
				{moment(rowData.time_start).format("lll")}
				{" - "}
				{moment(rowData.time_end).format("lll")}
			</p>
		);
	};
	const reviewBodyTemplate = (rowData) => {
		return (
			<span
				dangerouslySetInnerHTML={{
					__html: rowData?.reviews,
				}}
			></span>
		);
	};
	const handleDetail = (value) => {
		setValueDetail(value);
		setIsOpen(true);
	};

	const actionBodyTemplate = (rowData) => {
		return (
			<div>
				<PermissionButton
					name="viewDetailEvaluate"
					tooltip="Xem chi tiết"
					onClick={() => handleDetail(rowData)}
					className="p-button-rounded p-button-text p-button-info"
					icon="pi pi-eye"
				/>

				{Number(rowData?.user_id) === Number(user.id) && (
					<PermissionButton
						name="evaluate"
						tooltip="Cập nhật"
						onClick={() =>
							history.push(
								`/admin/candidate/interview/edit/${rowData.id}`
							)
						}
						className="p-button-rounded p-button-text p-button-help"
						icon="pi pi-pencil"
					/>
				)}
			</div>
		);
	};

	return (
		<div>
			<Dialog
				visible={isOpen}
				onHide={() => setIsOpen(false)}
				position="top"
				style={{ width: "90%" }}
			>
				<CandidateDetail data={valueDetail} />
			</Dialog>
			<CustomBreadCrumb items={items} />
			<div className="card">
				<CustomDataTable dataTable={candidateInterview}>
					<Column
						field="candidate_id"
						header="Thời gian phỏng vấn"
						body={timeBodyTemplate}
						style={{ width: "19%" }}
					></Column>
					<Column
						field="candidate_name"
						header="Họ tên ứng viên"
					></Column>
					<Column field="job_name" header="Dự án"></Column>
					<Column
						field="viTriUngTuyen"
						header="Vị trí ứng tuyển"
					></Column>
					<Column
						field=""
						header="Nhận xét"
						body={reviewBodyTemplate}
					></Column>
					<Column field="result" header="Kết quả"></Column>
					<Column
						header="Hành động"
						body={actionBodyTemplate}
					></Column>
				</CustomDataTable>
			</div>
		</div>
	);
};

export default CandidateInterViewShow;
