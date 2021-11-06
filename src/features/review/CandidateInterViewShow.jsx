import CustomBreadCrumb from "components/CustomBreadCrumb";
import CustomDataTable from "components/CustomDataTable";
import moment from "moment";
import { Column } from "primereact/column";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCandidateInterview } from "redux/candidateInterview/action";
import "moment/locale/vi";
import { getCandidateInterviews } from "redux/candidateInterview/selector";
import { Dialog } from "primereact/dialog";
import CandidateDetail from "./CandidateDetail";
import { useHistory } from "react-router";
import { fetchJobRequest } from "redux/jobRequest/actionCreator";
import { getCandidate } from "redux/candidate/action";

const items = [{ label: "Đánh Giá Ứng viên" }, { label: " Đánh giá" }];
const CandidateInterViewShow = () => {
  moment.locale("vi");
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [valueDetail, setValueDetail] = useState();
  const history = useHistory();

  const candidateInterview = useSelector(getCandidateInterviews);

  useEffect(() => {
    dispatch(getCandidateInterview());
    dispatch(fetchJobRequest());
    dispatch(getCandidate());
  }, [dispatch]);

  const timeBodyTemplate = (rowData) => {
    return (
      <p>
        {moment(rowData.time_start).format("lll")}
        {" - "}
        {moment(rowData.time_end).format("lll")}
      </p>
    );
  };

  const handleDetail = (value) => {
    setValueDetail(value);
    setIsOpen(true);
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <div>
        <i
          className="pi pi-eye mr-1"
          style={{ color: "blue", padding: "0 10px" }}
          onClick={() => handleDetail(rowData)}
        ></i>
        <i
          className="pi pi-pencil"
          style={{ color: "orange" }}
          onClick={() =>
            history.push(`/admin/candidate/interview/edit/${rowData.id}`)
          }
        ></i>
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
      <CustomDataTable value={candidateInterview}>
        <Column
          field="candidate_id"
          header="Thời gian phỏng vấn"
          body={timeBodyTemplate}
          style={{ width: "19%" }}
        ></Column>
        <Column field="candidate_name" header="Họ tên ứng viên"></Column>
        <Column field="job_name" header="Dự án"></Column>
        <Column field="viTriUngTuyen" header="Vị trí ứng tuyển"></Column>
        <Column field="reviews" header="Nhận xét"></Column>
        <Column header="Hành động" body={actionBodyTemplate}></Column>
      </CustomDataTable>
    </div>
  );
};

export default CandidateInterViewShow;
