var fs = require("fs");
var path = require('path');
var multer = require('multer');
var nodemailer = require('nodemailer');
var mongoose = require('mongoose');
mongoose.Promise = Promise;

//
// Mongoose Functions
//
var Tickets = mongoose.model('Tickets', {ticketId: Number, equipName: String, dateReported: String, userDesc: String, dateResolved: String, interactive: String, imageUrl: String, actionTaken: String, administrator: String});
var Status = mongoose.model('Status', {equipId: Number, equipName: String, status: Number});
var equipCount = 0;
var ticketCount = 0;

Status.find(function (err, results) {
	equipCount = results.length;
});

Tickets.find(function (err, results) {
	ticketCount = results.length;
});

//
// Nodemailer functions
//
var transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: 'tribefan25eric@gmail.com',
		pass: 'Triberocks123'
	}
});

transporter.verify(function(error, success) {
   if (error) {
        console.log(error);
   } else {
        console.log('Connection to e-mail server available');
   }
});

//
// Multer functions
//
var storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, 'C:/Users/Eric/Documents/Akron U/Honors/Server/TicketImages');
  },
  filename: function (req, file, callback) {
    callback(null, file.originalname);
  }
});

var upload = multer({ storage : storage}).single('image');

module.exports = function(app) {
	app.get('/api/equipment', function(req,res){
		Status.find(function(err, data) {
            if (err) res.send(err)
            res.json(data);
        });
	});
	
	app.get('/api/tickets', function(req,res){
		Tickets.find(function(err, data) {
            if (err) res.send(err)
            res.json(data);
        });
	});
	
	app.get('/api/resolutionForm/:id', function(req,res){
		Tickets.findOne({'ticketId': req.params.id},'ticketId equipName',function(err, data) {
            if (err) res.send(err);
            res.json(data);
        });
	});
	
	app.post('/api/submitResolution/:id', function(req,res){
		Tickets.findOne({'ticketId': req.params.id},function(err,data) {
			if(err) res.send(err)
			data.dateResolved = new Date();
			data.actionTaken = req.body.actions;
			data.administrator = req.body.name;
			data.save(function(err,newData){
				if(err) res.send(err);
					Status.findOne({'equipName': newData.equipName},function(err,data) {
					if(err) res.send(err)
					data.status=1;
					data.save(function(err,newData){
					if(err) res.send(err);
					res.sendStatus(200);
					});
				});
			});
		});
	});

	app.get('/tickets', function(req,res){
		res.sendFile(__dirname + '/tickets.html');
	});
	
	app.get('/equipment', function(req,res){
		res.sendFile(__dirname + '/equipment.html');
	});
	
	app.get('/resolution/:id', function(req,res){
		res.sendFile(__dirname + '/resolutionForm.html');
	});
	
	app.get('/interactive/:id', function(req,res){
		res.sendFile(__dirname + '/CGTermProj.html');
	});

	app.get('/', function(req,res){
		res.sendFile(__dirname + '/index.html');
	});

	app.get('/equipmentstatus/:id', function(req,res){
		if(req.params.id<=0 || req.params.id>equipCount)
		{
			res.send("No item exists for that ID");
			return;
		}
		  Status.findOne({"equipId": req.params.id}, function(err, result) {
			if (err) throw err;
			res.send(String(result.status));
		 });
	});
	
	app.post('/api/reportIncident/:id', function(req,res){
		if(req.params.id<=0 || req.params.id>equipCount)
		{
			res.send("No item exists for that ID");
			return;
		}
		
		upload(req,res,function(err){
            if(err){
                 res.end({error_code:1,err_desc:err});
                 return;
			}
			
			fs.rename('./TicketImages/upload.jpg','./TicketImages/'+(ticketCount+1)+'.jpg',function(err){
				if(err) console.log(err);
			});
			
			var equipName = "";
			
			Status.findOne({"equipId": req.params.id}, function(err, result) {
				if (err) throw err;
			 }).then(function(doc){
				Tickets.create({"ticketId": ticketCount+1, "equipName": doc.equipName, "dateReported": new Date().toString(), "dateResolved": "", "userDesc": req.body.userDesc, "imageUrl": (ticketCount+1)+".jpg", "interactive": ""}, function(err, result) {
					if(err) throw err;
					ticketCount += 1;
				});
			});
			
			Status.update({"equipId": req.params.id}, {$set: { "status": 0 }}, function(err, result) {
				if (err) throw err;
			});
			
			var mailOptions = {
				from: 'tribefan25eric@gmail.com',
				to: 'tribefan25eric@gmail.com',
				subject: 'Issue reported for equipment with ID: '+req.params.id,
				text: 'An issue has been reported!'
			};
			
			transporter.sendMail(mailOptions, function(error, info){
				if (error) {
					console.log(error);
					res.send('E-mail did not send!');
				} else {
					console.log('Email sent: ' + info.response);
					res.send('E-mail sent!');
				}
			});
		});
	});
	
	app.post('/api/upload/:id', function(req,res){
		console.log(req.body);
		res.sendStatus(200);
	});
}