import { FORGOT_PASSWORD } from "constants/appPath";
import { Button } from "primereact/button";
import React from "react";
import { useForm } from "react-hook-form";
import { useHistory, useLocation } from "react-router";
import UserService from "services/UserService";
import genElementsForm from "utils/genElementsForm";

const RestPassword = () => {
	const { search } = useLocation();
	const {
		control,
		formState: { errors },
		handleSubmit,
		reset,
	} = useForm();
	const history = useHistory();

	const fields = [
		{
			name: "password",
			label: "Nhập mật khẩu mới.",
			type: "inputText",
			placeholder: "Mật khẩu",
		},
		{
			name: "password_confirmation",
			label: "Nhập lại mật khẩu mới.",
			type: "inputText",
			placeholder: "Nhập mật khẩu",
		},
	];
	const service = new UserService();
	const formRender = genElementsForm(fields, control, errors);
	const onHandleSubmit = async (data) => {
		try {
			await service.restPassword({
				...data,
				token: search.replace("?token=", ""),
			});
		} catch (error) {}
	};
	return (
		<>
			<h1 style={{ textAlign: "center", marginTop: "10%" }}>
				Vui lòng bạn nhập mật khẩu mới
			</h1>
			<form onSubmit={handleSubmit(onHandleSubmit)}>
				<div className="p-fluid p-formgrid p-grid flex-direction align-items">
					{formRender}
				</div>
				<div
					className="flex"
					style={{ width: "150px", margin: "0 auto" }}
				>
					<>
						<Button
							style={{
								display: "block",
								margin: "0 auto",
								marginTop: "30px",
							}}
							type="submit"
							label="Lưu"
						/>
						<Button
							style={{
								display: "block",
								margin: "0 auto",
								marginTop: "30px",
							}}
							onClick={() => history.push(FORGOT_PASSWORD)}
							label="Quay lại"
						/>
					</>
				</div>
			</form>
		</>
	);
};

export default RestPassword;