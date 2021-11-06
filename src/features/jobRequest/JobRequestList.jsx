import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

import CustomBreadCrumb from "components/CustomBreadCrumb";
import CustomDataTable from "components/CustomDataTable";
import JobRequestDetail from "./JobRequestDetail";

import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { Tag } from "primereact/tag";
import { MultiSelect } from "primereact/multiselect";
import { Calendar } from "primereact/calendar";

import {
  approvalJobRequest,
  deleteJobRequest,
  fetchJobRequest,
  rejectJobRequest,
  resetStatus,
} from "redux/jobRequest/actionCreator";
import { getStatusJobRequest, getJobRequest } from "redux/jobRequest/selector";
import { APPROVAL_STATUS, STATUS_REQUEST } from "constants/app";
import formatTime from "utils/formatTime";
import { compareTimeFromTo } from "utils/compareTime";
import { showConfirm } from "redux/confirmBox/actionCreator";

const items = [{ label: "Yêu cầu tuyển dụng" }, { label: "Danh sách yêu cầu" }];

const cols = [
  // { field: "description", header: "Dac diem cua du an" },
  { field: "title", header: "Tên dự án", width: "250px" },
  { field: "deadline", header: "Hạn tuyển", width: "120px" },
  { field: "position", header: "Vị trí tuyển dụng", width: "250px" },
  { field: "amount", header: "Số lượng tuyển", width: "150px" },
  { field: "petitioner", header: "Người yêu cầu", width: "150px" },
  { field: "status", header: "Trạng thái", width: "100px" },
  { field: "action", header: <i className="pi pi-cog" />, width: "200px" },
];

const JobRequestList = () => {
  const dispatch = useDispatch();
  const status = useSelector(getStatusJobRequest);
  const data = useSelector(getJobRequest);
  const history = useHistory();
  const [jobDetail, setJobDetail] = useState();
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState(false);
  const [statusFilter, setStatusFilter] = useState([]);
  const [deadLine, setDeadLine] = useState([]);
  const { user } = JSON.parse(localStorage.getItem("currentUser"));

  const statuses = [
    { id: 0, name: "Từ chối", code: "TU_CHOI", severity: "danger" },
    { id: 1, name: "Đã duyệt", code: "DA_DUYET", severity: "success" },
    { id: 2, name: "Hết hạn", code: "HET_HAN", severity: "danger" },
    { id: 3, name: "Chờ duyệt", code: "MOI_TAO", severity: "primary" },
  ];

  const handleClickView = (data) => {
    setJobDetail(data);
    setIsOpen(true);
  };

  const handleClickUpdate = (data) => {
    history.push(`/admin/jobrequest/edit/${data.id}`);
  };

  const handleClickDelete = (data) => {
    dispatch(
      showConfirm(
        "Bạn có chắc muốn xóa yêu cầu tuyển dụng này không?",
        () => {
          dispatch(deleteJobRequest(data.id));
        },
        () => {
          console.log("Không");
        }
      )
    );
  };

  const handleClickApproval = (data) => {
    dispatch(
      showConfirm(
        "Bạn có chắc muốn phê duyệt yêu cầu tuyển dụng này không?",
        () => {
          dispatch(approvalJobRequest(data.id));
        },
        () => {
          console.log("Phe duyet cc");
        }
      )
    );
  };

  const handleClickReject = (data) => {
    dispatch(
      showConfirm(
        "Bạn có chắc muốn từ chối yêu cầu tuyển dụng này không?",
        () => {
          dispatch(rejectJobRequest(data.id));
        },
        () => {
          console.log("Tu choi cc");
        }
      )
    );
  };

  const genFormatTimeCol = (data) => {
    return formatTime.formatShortDate(data.deadline);
  };

  const genStatusCol = (data) => {
    switch (data.status) {
      case APPROVAL_STATUS.TU_CHOI:
        return <Tag className="p-mr-2" severity="danger" value="Từ chối" />;
      case APPROVAL_STATUS.DA_DUYET:
        return <Tag className="p-mr-2" severity="success" value=" Đã duyệt" />;
      case APPROVAL_STATUS.HET_HAN:
        return <Tag className="p-mr-2" severity="danger" value="Hết hạn" />;
      case APPROVAL_STATUS.CHO_DUYET:
        return <Tag className="p-mr-2" value="Chờ duyệt" />;
      default:
        break;
    }
  };

  console.log('USER', user.role !== 1)

  const genActionCol = (data) => {
    return (
      <>
        <Button
          tooltip="Xem chi tiết"
          onClick={() => handleClickView(data)}
          className="p-button-rounded p-button-text p-button-info"
          icon="pi pi-eye"
        />
        <Button
          tooltip="Cập nhật"
          onClick={() => handleClickUpdate(data)}
          className="p-button-rounded p-button-text p-button-help"
          icon="pi pi-pencil"
          disabled={data.status !== APPROVAL_STATUS.CHO_DUYET}
        />
        <Button
          tooltip="Xóa"
          onClick={() => handleClickDelete(data)}
          className="p-button-rounded p-button-text p-button-danger"
          icon="pi pi-trash"
          disabled={data.status !== APPROVAL_STATUS.CHO_DUYET}
        />
        <Button
          tooltip="Phê duyệt"
          onClick={() => handleClickApproval(data)}
          className="p-button-rounded p-button-text p-button-danger"
          icon="pi pi-check-circle"
          disabled={
            data.status !== APPROVAL_STATUS.CHO_DUYET || user.role !== 1
          }
        />
        <Button
          tooltip="Từ chối"
          onClick={() => handleClickReject(data)}
          className="p-button-rounded p-button-text p-button-danger"
          icon="pi pi-times-circle"
          disabled={
            data.status !== APPROVAL_STATUS.CHO_DUYET || user.role !== 1
          }
        />
      </>
    );
  };

  const statusTemplate = (option) => {
    return (
      <Tag className="p-mr-2" severity={option.severity} value={option.name} />
    );
  };

  const selectedStatusTemplate = (option) => {
    if (option) {
      return (
        <Tag
          className="p-mr-2"
          severity={option.severity}
          value={option.name}
        />
      );
    }

    return "Trạng thái";
  };

  const columns = cols.map(({ field, header, width }) => {
    switch (field) {
      case "action":
        return (
          <Column
            key={field}
            header={header}
            body={genActionCol}
            style={{
              textAlign: "center",
              width: width,
            }}
          />
        );

      case "deadline":
        return (
          <Column
            key={field}
            header={header}
            body={genFormatTimeCol}
            style={{
              width: width,
            }}
          />
        );

      case "status":
        return (
          <Column
            key={field}
            header={header}
            body={genStatusCol}
            style={{
              width: width,
            }}
          />
        );

      default:
        return (
          <Column
            key={field}
            header={header}
            field={field}
            style={{
              width: width,
            }}
          />
        );
    }
  });

  const dataFilter = useMemo(() => {
    const statusSelected = statusFilter.map((item) => item.id);

    if (statusSelected.length === 0 && deadLine.length === 0) {
      return data;
    }

    return (
      Array.isArray(data) &&
      data.filter((item) => {
        return (
          (statusSelected.length === 0 ||
            statusSelected.indexOf(item.status) !== -1) &&
          (deadLine.length === 0 ||
            compareTimeFromTo(item.deadline, deadLine[0], deadLine[1]))
        );
      })
    );
  }, [deadLine, statusFilter, data]);

  return (
    <>
      <JobRequestDetail
        jobDetail={jobDetail}
        isOpen={isOpen}
        onHide={() => setIsOpen(false)}
        handleClickUpdate={handleClickUpdate}
        handleDelete={handleClickDelete}
      />

      <CustomBreadCrumb items={items} />

      <div className="filter">
        <Button
          icon="pi pi-plus"
          className="p-button-raised"
          label="Thêm mới"
          onClick={() => history.push("/admin/jobrequest/create")}
        />
        <Button
          icon="pi pi-filter"
          className="p-button-raised p-button-help"
          label="Bộ lọc"
          onClick={() => setFilter(!filter)}
        />

        <div className={`card filter_element ${!filter && "hide"}`}>
          <Calendar
            id="range"
            className="mr-1"
            value={deadLine}
            showButtonBar
            dateFormat="dd/mm/yy"
            onChange={(e) => setDeadLine(e.value)}
            onClearButtonClick={() => setDeadLine([])}
            selectionMode="range"
            placeholder="Hạn tuyển"
            readOnlyInput
          />
          <MultiSelect
            value={statusFilter}
            itemTemplate={statusTemplate}
            selectedItemTemplate={selectedStatusTemplate}
            options={statuses}
            onChange={(e) => setStatusFilter(e.value)}
            optionLabel="name"
            placeholder="Trạng thái"
            display="chip"
          />
        </div>
      </div>

      {status === STATUS_REQUEST.LOADING && "Đang tải dữ liệu..."}
      {status === STATUS_REQUEST.ERROR && data}
      {Array.isArray(data) && data.length > 0 && (
        <div className="card">
          <CustomDataTable
            selectionMode="single"
            dataTable={dataFilter}
            showSearch={true}
          >
            {columns}
          </CustomDataTable>
        </div>
      )}
    </>
  );
};

export default JobRequestList;
