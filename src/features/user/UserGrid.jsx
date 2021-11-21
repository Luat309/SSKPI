import CustomDataTable from "components/CustomDataTable";
import { Column } from "primereact/column";
import { Fieldset } from "primereact/fieldset";
import { Button } from "primereact/button";
import { ACCOUNT_STATUS } from "constants/app";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { showConfirm } from "redux/confirmBox/actionCreator";
import { Dialog } from "primereact/dialog";
import FeaturesDialog from "./featuresDialog";

const UserGrid = (props) => {
  const [dataSelected, setDataSelected] = useState(null);
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setDataSelected(null);
  }, [props?.dataTable]);

  const handleSelectionChange = (data) => {
    setDataSelected(data.value);

    props.callback(data.value);
  };

  const handleClickDelete = (id) => {
    dispatch(
      showConfirm("Bạn có chắc muốn xóa tài khoản này không?", () => {
        console.log("XOA LUON");
      })
    );
  };

  const handleClickLock = (data) => {
    if (data.status === 1) {
      dispatch(
        showConfirm("Bạn có chắc muốn vô hiệu hóa tài khoản này không?", () => {
          console.log("VO HIEU HOA LUON");
        })
      );
    } else if (data.status === 0) {
      dispatch(
        showConfirm("Bạn có chắc mở hoạt động tài khoản này không?", () => {
          console.log("VO HIEU HOA LUON");
        })
      );
    }
  };

  const genActionCol = (data) => {
    return (
      <>
        <Button
          tooltip="Cập nhật"
          onClick={() => props.onOpenDialog(data, "UPDATE")}
          className="p-button-rounded p-button-text p-button-help"
          icon="pi pi-pencil"
        />
        <Button
          tooltip="Xóa"
          onClick={() => handleClickDelete(data)}
          className="p-button-rounded p-button-text p-button-danger"
          icon="pi pi-trash"
        />
        {data.status === 1 ? (
          <Button
            tooltip="Khóa tài khoản"
            onClick={() => handleClickLock(data)}
            className="p-button-rounded p-button-text p-button-danger"
            icon="pi pi-lock"
          />
        ) : (
          <Button
            tooltip="Mở tài khoản"
            onClick={() => handleClickLock(data)}
            className="p-button-rounded p-button-text p-button-success"
            icon="pi pi-unlock"
          />
        )}
        <Button
          tooltip="Quyền truy cập"
          onClick={() => setVisible(true)}
          className="p-button-rounded p-button-text"
          icon="pi pi-cog"
        />
      </>
    );
  };

  const genStatusCol = (data) => ACCOUNT_STATUS[data.status];

  const cols = [
    {
      field: "employee_code",
      header: "Mã nhân viên",
    },
    {
      field: "name",
      header: "Họ tên",
    },
    {
      field: "status",
      header: "Trạng thái",
      body: genStatusCol,
    },
    {
      field: "action",
      header: <i className="pi pi-cog" />,
      body: genActionCol,
      style: { textAlign: "center" },
    },
  ];

  const columns = cols.map((col) => <Column key={col.field} {...col} />);

  return (
    <>
      <Dialog
        header={"Quyền truy cập chức năng"}
        visible={visible}
        style={{ width: "60%" }}
        onHide={() => setVisible(false)}
      >
        <FeaturesDialog />
      </Dialog>
      <Fieldset className="mt-1" legend="Danh sách nhân viên" toggleable>
        <Button
          icon="pi pi-plus"
          className="p-mb-2"
          label="Thêm nhân viên"
          onClick={() => props.onOpenDialog()}
        />
        <CustomDataTable
          dataTable={props?.dataTable}
          selection={dataSelected || props?.dataTable?.[0]}
          selectionMode="single"
          onSelectionChange={handleSelectionChange}
          stripedRows={false}
          rows={5}
          showSearch={true}
        >
          {columns}
        </CustomDataTable>
      </Fieldset>
    </>
  );
};

export default UserGrid;