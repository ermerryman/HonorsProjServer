use gymapp

db.status.remove({})

db.status.insert(
	[
		{equipId:1,equipName:"Free Weight Bench",status:1,imageURL:"freeweightbench.jpg"},
		{equipId:2,equipName:"Leg Press",status:0,imageURL:"legpress.jpg"},
		{equipId:3,equipName:"Squat Rack",status:0,imageURL:"squatrack.jpg"},
		{equipId:4,equipName:"Treadmill",status:1,imageURL:"treadmill.png"},
		{equipId:5,equipName:"Pec Fly Machine",status:1,imageURL:"pecflymachine.jpg"},
		{equipId:6,equipName:"Assisted Dip Machine",status:1,imageURL:"assisteddipmachine.jpg"},
		{equipId:7,equipName:"Lat Pull-down",status:1,imageURL:"latpulldown.png"},
		{equipId:8,equipName:"Preacher bench",status:1,imageURL:"preacherbench.jpg"},
		{equipId:9,equipName:"Hack squat",status:1,imageURL:"hacksquat.jpg"},
		{equipId:10,equipName:"Leg extension",status:1,imageURL:"LegExtension.jpg"},
		{equipId:11,equipName:"Leg curl",status:1,imageURL:"legcurl.jpg"},
		{equipId:12,equipName:"Standing calf raise",status:1,imageURL:"standingcalfraise.jpg"},
		{equipId:13,equipName:"Seated calf raise",status:1,imageURL:"seatedcalfraise.jpg"}
	]
)

db.tickets.remove({})

db.tickets.insert(
	[
		{ticketId:1,equipName:"Free Weight Bench",dateReported:Date(),dateResolved:Date(),imageUrl: "", interactive: ""},
		{ticketId:2,equipName:"Leg Press",dateReported:Date(),dateResolved: "",imageUrl: "2.jpg", interactive: "Yes"},
		{ticketId:3,equipName:"Squat Rack",dateReported:Date(),dateResolved: "",imageUrl: "", interactive: ""}
	]
)