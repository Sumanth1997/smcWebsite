import base from "./_base"
import { getServerSession } from "next-auth/next"
import { options } from "../auth/[...nextauth]"
export const config = {
    api: {
      externalResolver: true,
    },
  }
export default async function handler(req, res){
    const session = await getServerSession(req, res, options)
    const peopleAllInfo = [];
    const SMCpeople = [];
    const facultyList = [];
    const data = []

   
        base("Classes")
		.select({
			view: "ALL CLASSES",
		})
		.eachPage((records, fetchNextPage) => {
			records.forEach((record) => {
				const className = record.get("Name");
				const classDay = record.get("Week Day(s)");
				const classTime = record.get("Meeting Time");
				const recid = record.get("Rec ID");

                // data.push({name: className, day: classDay, time: classTime});
				data.push({id: recid, name: className, day: classDay, time: classTime});
			});

			fetchNextPage();
		},
		function done(err) {
			if (err) {
				console.error(err);
                res.status(503).end();
			}
            res.status(200).json(data);
		}
	);

}