import React, { useEffect, useRef, useState } from "react";
import socket from "./socket";
import { Link } from "react-router-dom";
import { useHistory } from "react-router";
import logo from "images/logo.png";
import { Menu } from "primereact/menu";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Badge } from "primereact/badge";
import { iconStyle } from "styles/icon.style";
import { MegaMenu } from "primereact/megamenu";
import { APP_MENU_ITEM } from "constants/appPath";
import NotificationList from "./NotificationList";
import {
	getIdCurrentUser,
	getNameCurrentUser,
	getRoleCurrentUser,
	// getRoleCurrentUser,
} from "utils/localStorage";
import { NODEJS } from "constants/app";
// import { NODEJS } from "constants/app";
const sound = require("./sound.mp3");

// const notifications = [];

const TopBar = (props) => {
	const history = useHistory();
	const [notifications, setNotifications] = useState([]);
	const [visible, setVisible] = useState(false);

	const playSound = () => {
		const audio = new Audio(sound.default);

		audio.play();
	};

	useEffect(() => {
	  (async () => {
	    const res = await fetch(NODEJS + "api/node/notifications", {
	      method: "post",
	      body: JSON.stringify({
	        id: getIdCurrentUser(),
	        role: getRoleCurrentUser(),
	      }),
	      headers: {
	        "Content-Type": "application/json",
	      },
	    });
	    const data = await res.json();

	    setNotifications((prevState) => prevState.concat(data));
	  })();

	  document.addEventListener("click", () => {
	    setVisible(false);
	  });
	}, []);

	useEffect(() => {
		socket.on("res_notification", (data) => {
			const idCurrentUser = getIdCurrentUser();

			if (data.userCreated !== idCurrentUser) {
				playSound();
				setNotifications((prevState) => [data, ...prevState]);
			}
		});
	}, []);

	const menu = useRef(null);
	const itemsAccount = [
		{
			label: "Thông tin tài khoản",
			icon: "pi pi-external-link",
			command: (e) => {
				history.push("/admin/user/infomation");
			},
		},
		{
			label: "Đổi mật khẩu",
			icon: "pi pi-external-link",
			command: (e) => {
				history.push("/admin/user/change_password");
			},
		},
		{
			label: "Đăng xuất",
			icon: "pi pi-upload",
			command: (e) => {
				localStorage.removeItem("currentUser");
				history.push("/login");
			},
		},
	];

	const handleClick = (e) => {
		e.stopPropagation();
		setVisible(!visible);
	};

	return (
		<>
			<div className="layout-topbar">
				<Link to="/">
					<img src={logo} alt="SSKPI" />
				</Link>

				<ul className="topbar-menu">
					<li style={{ position: "relative", cursor: "pointer" }}>
						<i
							onClick={handleClick}
							className="pi pi-bell p-overlay-badge"
							style={iconStyle}
						>
							{notifications.length > 0 && (
								<Badge value={notifications.length} />
							)}
						</i>
						{visible && (
							<NotificationList notifications={notifications} />
						)}
					</li>

					<li style={{ width: "auto" }}>
						<Menu
							model={itemsAccount}
							popup
							ref={menu}
							id="popup_menu"
						/>
						<Button
							label={"Hi, " + getNameCurrentUser()}
							onClick={(event) => menu.current.toggle(event)}
							aria-controls="popup_menu"
							aria-haspopup
						/>
					</li>
				</ul>
			</div>
			{props.layout.name === "Horizontal" && (
				<MegaMenu
					style={{
						padding: "5px",
					}}
					model={APP_MENU_ITEM}
				/>
			)}
		</>
	);
};

export default React.memo(TopBar);
