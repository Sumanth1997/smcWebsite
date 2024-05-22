import React from "react";
import base from "./airtable";
import { Button as NextButton } from "@nextui-org/react";
import Modal from "@mui/material/Modal";
import Backdrop from "@mui/material/Backdrop";
import Fade from "@mui/material//Fade";
import Typography from "@mui/material/Typography";


async function createRecordAsync(fields){
	await fetch("/api/air/CreateRecord", {
		method: "POST", // *GET, POST, PUT, DELETE, etc.
		mode: "cors", // no-cors, *cors, same-origin
		cache: "default", // *default, no-cache, reload, force-cache, only-if-cached
		credentials: "same-origin", // include, *same-origin, omit
		headers: {
		  "Content-Type": "application/json",
		  // 'Content-Type': 'application/x-www-form-urlencoded',
		},
		redirect: "follow", // manual, *follow, error
		referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
		body: JSON.stringify(fields), // body data type must match "Content-Type" header
	  });
}

// async function createRecord(fields) {
// 	try {
// 		const records = await base("Events").create([{ fields }]);

// 		records.forEach(function (record) {
// 			console.log(record.getId());
// 		});
// 	} catch (err) {
// 		console.error(err);
// 	}
// }

async function updateRecordAsync(eventID, fields) {
    const body = JSON.stringify({ eventID, fields });

    await fetch("/api/air/UpdateRecord", {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, *cors, same-origin
        cache: "default", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin", // include, *same-origin, omit
        headers: {
            "Content-Type": "application/json",
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: "follow", // manual, *follow, error
        referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin-when-cross-origin, unsafe-url
        body: body, // body data type must match "Content-Type" header
    });
}

//Commenting Old updaterecord
// async function updateRecord(eventID, fields) {
// 	fields.Students.push(updateUser.id);

// 	try {
// 		const records = await base("Events").update([{ id: eventID, fields }]);
// 		records.forEach(function () { 
// 			console.log("record updated");
// 		});
// 	} catch (err) {
// 		console.error(err);
// 	}
// }

export default function Submit({
	userSelected,
	sessionTitle,
	eventTypeSelected,
	facultySelected,
	usageSelected,
	roomSelected,
	startTimeSelected,
	endTimeSelected,
	courseSelected,
	gearSelected,
	eventID,
	newEvent,
	updateEvent,
	timeCorrect,
	setUserCount,
	setAddCourse,
	setAddGear,
	roomBookingRecord,
}) {
	const [open, setOpen] = React.useState(false);

	const handleSubmit = async () => {
		setOpen(true);
		console.log(userSelected); 
		const users = userSelected.map((obj) => obj.id);
		const faculties = facultySelected.map((obj) => obj.id);
		const courses = courseSelected.map((obj) => obj.key);
		const gears = gearSelected.map((obj) => obj.id);
		const locations = roomBookingRecord?.map((obj) => obj.id);
		const fields = {
			"Event Name": sessionTitle,
			"Start Time": startTimeSelected,
			"Proposed End Time": endTimeSelected,
			"🚪 Room(s)": roomSelected,
			Class: courses,
			"Event Type": eventTypeSelected,
			Faculty: faculties,
			Students: users,
			Status: "Booked ✅",
			"Intent of Use": usageSelected,
			"Gear Selection": gears,
			//Location: roomSelected,
			Location: locations,
		};
		console.log(fields)

		if (newEvent) {
			// await createRecord(fields);
			await createRecordAsync(fields);
		} else if (updateEvent) {
			// await updateRecord(eventID, fields);
			await updateRecordAsync(eventID, fields);
		}
	};

	const handleClose = () => {
		setUserCount(0);
		setAddCourse(false);
		setAddGear(false);

		setOpen(false);
		window.location.reload();
	};

	return (
		<div className="flex flex-col items-center justify-center gap-4">
			<NextButton
				shadow
				color="warning"
				onClick={handleSubmit}
				disabled={
					!(
						sessionTitle &&
						eventTypeSelected &&
						endTimeSelected &&
						startTimeSelected &&
						timeCorrect
					)
				}
			>
				SUBMIT
			</NextButton>

			<Modal
				className="flex items-center justify-center"
				open={open}
				onClose={handleClose}
				closeAfterTransition
				BackdropComponent={Backdrop}
				BackdropProps={{
					timeout: 500,
				}}
			>
				<Fade in={open}>
					<div className="bg-neutral-900 inline-block p-6 my-8 border border-yellow-500 text-white overflow-hidden shadow-xl transform transition-all">
						<Typography variant="h5" className="font-bold mb-2">
							Submission Successful!
						</Typography>
						<Typography>
							Please check your inbox for booking confirmation.
						</Typography>
					</div>
				</Fade>
			</Modal>
		</div>
	);
}
