//////////////////////// CLASSES //////////////////////////
class Reward {
	constructor(name, id, cId){
		this.name = name;
		this.value = 10; //default value of 10
		this.id = id;
		this.cID = cId;
	}
	exportObj(){
		var obj = {};
		obj.name = this.name;
		obj.value = this.value;
		obj.cID = this.cID;
		return obj;
	}
}

class Notification{
	constructor(descr, tName, cID, pID, id){
		this.description = descr;
		this.taskName = tName;
		this.childId = cID;
		this.parentId = pID;
		this.id = id;
	}
	exportObj(){
		var obj = {};
		obj.description = this.description;
		obj.taskName = this.taskName;
		obj.childId = this.childId;
		obj.parentId = this.parentId;
		obj.id = this.id;
		return obj;
	}
}


class Child {
	constructor(name, password, ky, id){
		this.name = name;
		this.password = password;
		this.key = ky;
		this.id = id;
		this.taskList = [];
		this.notList = [];
		this.points = 0;
		this.completedTasks = [];
		this.rewardList = [];
	}
	addNotification(not){
		this.notList.push(not);
	}

	removeNotification(nID){
		for (var i = 0; i < this.notList.length; i++) {
			if (nID == this.notList[i].id){
				//trace
				//console.log("Notification found");
				this.notList.splice(i,1);
			}
		}
	}

	addCompletedTasks(tsk){
		this.completedTasks.push(tsk);
	}

	//return 0 if found, -1 if not found
	findTask(tID){
		for (var i = 0; i < this.taskList.length; i++){
			if (tID == this.taskList[i].id){
				return this.taskList[i];
			}
		}
		return null;
	}

	addTask(tsk){
		this.taskList.push(tsk);
	}

	removeTask(tID){
		for (var i = 0; i < this.taskList.length; i++) {
			if (tID == this.taskList[i].id){
				//trace
				//console.log("Notification found");
				this.taskList.splice(i,1);
			}
		}
	}

	addPoints(pts){
		this.points += pts;
	}

	spendPoints(pts){
		this.points -= pts;
	}

	addReward(rwd){
		this.rewardList.push(rwd);
	}

	removeReward(rID){
		for (var i = 0; i < this.rewardList.length; i++) {
			if (rID == this.rewardList[i].id){
				//trace
				//console.log("Notification found");
				this.rewardList.splice(i,1);
			}
		}
	}

	exportObj(){
		var obj = {};
		obj.name = this.name;
		obj.password = this.password;
		obj.key = this.key;
		obj.id = this.id;
		obj.points = this.points;
		return obj;
	}
}

class Parent {
	constructor(name, password, ky){
		this.name = name;
		this.password = password;
		this.key = ky;
		this.childList = [];
		this.taskHistoryList = [];
		this.rewardList = [];
		this.notList = [];
		this.pendingTasks = [];
	}
	addNotification(not){
		this.notList.push(not);
	}
	removeNotification(nID){
		for (var i = 0; i < this.notList.length; i++) {
			if (nID == this.notList[i].id){
				this.notList.splice(i,1);
			}
		}
	}
	addPendingTask(tsk){
		this.pendingTasks.push(tsk);
	}

	getPendingTask(tskId){
		for(var i = 0; i < this.pendingTasks.length; i++){
			if(tskId == this.pendingTasks[i].id){
				return this.pendingTasks[i];
			}
		}

		return -1;
	}

	removePendingTask(tId){
        for (var i = 0; i < this.pendingTasks.length; i++) {
            if (this.pendingTasks[i].isComplete == true){
                this.pendingTasks.splice(i,1);
            }
        }
	}

	printVariables(){
		console.log(this.name);
		console.log(this.password);
		console.log(this.key);
	}
	addChild(chld){
		this.childList.push(chld);
	}
	addTaskHistory(tsk){
	    this.taskHistoryList.push(tsk);
    }
    addReward(rwrd){
		this.rewardList.push(rwrd);
	}
	exportObj(){
		var obj = {};
		obj.name = this.name;
		obj.password = this.password;
		obj.key = this.key;
		return obj;
	}
}

class Task{
	constructor(name, dueDate, mandatory, pkey, cID, id, pts){
		this.name = name;
		this.dueDate = dueDate;
		this.mandatory = mandatory;
		this.id = id;
		this.pKey = pkey;
		this.cID = cID;
		this.isComplete = false;
		this.isPending = false;
		this.value = pts;
	}
    exportObj(){
        var obj = {};
        obj.name = this.name;
        obj.dueDate = this.dueDate;
        obj.mandatory = this.mandatory;
        obj.pKey = this.pKey;
        obj.isComplete = this.isComplete;
		obj.isPending = this.isPending;
		obj.value = this.value;
		obj.id = this.id;
        return obj;
    }
}

///////////////////////// SERVER /////////////////////////
//array to store parent objects
const fs = require('fs');
var parentList = [];
var childList = [];
var taskList = [];
var rewardList = [];
//var notList = [];
var loggedIn = [];
var childLoggedIn = [];
var pendingTasks = [];

//hardcoded data
var task1 = new Task("Clean Room", "11/2/2000", "mandatory", 100, 1, 1, 10);
var task2 = new Task("Clean teeth", "3/25/2006", "optional", 100, 1, 2, 10);
var task3 = new Task("Dishes", "3/18/2018", "mandatory", 100, 1, 3, 10);
task2.isComplete = true;
task3.isPending = true;

var parent1 = new Parent("bob", "123", 100);
var parent2 = new Parent("tom", "123", 101);
var child1 = new Child("bobjr", "a", 100, 1);
var child2 = new Child("tomjr", "b", 101, 2);
var not1 = new Notification("New task", task1.name, child1.id, parent1.key, 1);
var not2 = new Notification("Task complete", task2.name, child1.id, parent1.key, 2);
var pNot1 = new Notification("New child", "bobjr", 1, 100, 3);
var reward = new Reward("PS4", 1, child1.id);
var reward2 = new Reward("Gaming PC", 2, child1.id);
var pNot2 = new Notification("New Reward", reward.name, child1.id, parent1.key, 3);
var pNot3 = new Notification("Pending Task", task3.name, child1.id, parent1.key, 4);

rewardList.push(reward);
rewardList.push(reward2);
parentList.push(parent1);
parentList.push(parent2);
parentList[0].addChild(child1);
parentList[1].addChild(child2);
//parentList[0].addChild(child2);
childList.push(child1);
childList.push(child2);
//notList.push(not1);
//notList.push(not2);

child1.addTask(task1);
//child1.addTask(task2);

child1.addNotification(not1);
child1.addNotification(not2);
parent1.addNotification(pNot1);
//parent1.addNotification(pNot2);
parent1.addNotification(pNot3);
parent1.addReward(reward);
parent1.addPendingTask(task3);
child1.addCompletedTasks(task3);
child1.addReward(reward);
child1.addReward(reward2);

parentList[0].addTaskHistory(task1);
parentList[0].addTaskHistory(task2);
parentList[0].addTaskHistory(task3);
taskList.push(task1);
taskList.push(task2);
taskList.push(task3);

//key placeholder
var sKey = 123;
var sChldKey = 5;
var sNotKey = 5;
var sTaskKey = 10;
var rKey = 5;
//TODO: load parents.json into parentList
//TODO: load children.json into childList
//TODO: Start sKey after keys loaded from parents.json

//Description: checks key against family account keys stored
//	in Parent class. Returns Parent object with matching
//	key.
function findParent(key){
	for (var i = 0; i < parentList.length; i++) {
		var prnt = parentList[i];			
		var prntKey = prnt.key;
		if (prntKey == key){
			return prnt;
		}
	}
}

function findChild(name){
    for(var i = 0; i < childList.length; i++){
        if(name === childList[i].name){
            return childList[i];
        }
    }
}

function findChildbyID(id){
	for (var i = 0; i < childList.length; i++){
		if(id == childList[i].id){
			return childList[i];
		}
	}
}

function findTask(tID){
    for(var i = 0; i < taskList.length; i++){
        if(tID == taskList[i].id){
            return taskList[i];
        }
    }
}

function findReward(rID) {
	for(var i = 0; i<rewardList.length; i++){
		if(rID === rewardList[i].id){
			return rewardList[i];
		}
	}

}

function findNotification(nID){
    for(var i = 0; i < notList.length; i++){
        if(nID === notList[i].id){
		//trace
		console.log("Found notification");
            return notList[i];
        }
    }
}

//Description: stores name, password, key in json object
//	json objects are stored in parents.json
function storeParents(){
	//TODO: check if parent exists ???
	var parentObj = {};
	var parentsFound = false;
	for (var i = 0; i < parentList.length; i++){
		var obj = parentList[i].exportObj();
		var objKey = "Parent " + i;
		parentObj[objKey] = obj;
		parentsFound = true;
	}
	if (parentsFound){
		var parents = JSON.stringify(parentObj);
		fs.writeFileSync('parents.json', parents);
	}
}

//Description: store name, password, key in json object
//	json objects are stored in children.json
function storeChildren(){
	//TODO: check if child exists ???
	var childObj = {};
	var childrenFound = false;
	for (var i = 0; i < childList.length; i++){
		var obj = childList[i].exportObj();
		var objKey = "Child " + i;
		childObj[objKey] = obj;
		childrenFound = true;
	}
	if (childrenFound){
		var children = JSON.stringify(childObj);
		fs.writeFileSync('children.json', children);
	}
}

function storeTasks(){
    //TODO: check if task exists ???
    var taskObj = {};
    var tasksFound = false;
    for (var i = 0; i < taskList.length; i++){
        var obj = taskList[i].exportObj();
        var objKey = "Task " + i;
        taskObj[objKey] = obj;
        tasksFound = true;
    }
    if (tasksFound){
        var tasks = JSON.stringify(taskObj);
        fs.writeFileSync('tasks.json', tasks);
    }
}

function getTask(pKey){
	var tasks = [];
	for(var i = 0; i < taskList.length; i++){
		if(taskList[i].pKey == pKey){
			tasks.push(taskList[i]);
		}
	}
	return tasks;
}

function getKey(username){
	for (var i = 0; i < parentList.length; i++) {
		var prnt = parentList[i];
		var prntName = prnt.name;
		if (prntName === username){
			return prnt.key;
		}
	}
	return -1;
}

//Setup server variables and libraries
var express = require('express');
var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var bodyParser = require('body-parser');
var request = require('request');

//Setup express
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 4428);
var path = require('path');
app.use(express.static(path.join(__dirname, 'public')));

//home page
app.get('/', function(req,res,next){
	var context = {};
	res.render('home', context);
	});

app.post('/login', function(req, res, next){
    var context = {};
    var prntKey = getKey(req.body.username);
    var chldObj = findChild(req.body.username);
    var passWrd = req.body.password;
    if (prntKey == -1 && chldObj == null){
        context.msg = "Cannot find parent, account doesn't exist";
        res.render('home', context);
    }
    else {
        if (prntKey != -1) {
            var prntObj = findParent(prntKey);
	    if (prntObj.password != passWrd){
		context.msg = "Password does not match";
		res.render('home', context);	
	    }	
	    else{
		    context.parent = prntObj.name;
			context.child = prntObj.childList;
			context.notification = prntObj.notList;
			context.task = prntObj.pendingTasks;
		    //trace
			//console.log(prntObj.pendingTasks);
		    loggedIn[0] = prntObj.key;	//store logged in parent's key to loggedIn[0]
		    res.render('parentHome', context);
	    }
        }
        else {
	    if (chldObj.password != passWrd){
		context.msg = "Password does not match";
		res.render('home', context);
	    }
	    else{
		    childLoggedIn[0] = chldObj.id;
		    context.child = chldObj.name;
		    context.points = chldObj.points;
		    context.task = chldObj.taskList;
		    context.rewards = chldObj.rewardList;
		    context.notification = chldObj.notList;
		    res.render('childHome', context);
	    }
        }
    }});

app.get('/createReward', function(req, res, next){
	var context = {};
	var childObj = findChildbyID(childLoggedIn[0]);
	context.child = childObj.name;

	res.render('createReward', context);
});

app.post('/createReward', function(req, res, next){
	var context = {};
	var rewardName = req.body.rewardName;
	var newReward = new Reward(rewardName, rKey, childLoggedIn[0]);
	rKey++;
	rewardList.push(newReward);

	var chld = findChildbyID(childLoggedIn[0]);
	var prnt = findParent(chld.key);
	var notify = new Notification("New reward", rewardName, childLoggedIn[0], chld.key, sNotKey);
	sNotKey++;

	prnt.addNotification(notify);
	prnt.addReward(newReward);
	chld.addReward(newReward);
	context.child = chld.name;
	context.task = chld.taskList;
	context.rewards = chld.rewardList;
	context.notification = chld.notList;
    context.points = chld.points;

	res.render('childHome', context);
});

app.post('/requestReward', function(req, res, next){
	var context = {};
	var rewardName = req.body.reqReward;
	var chld = findChildbyID(childLoggedIn[0]);
	var prnt = findParent(chld.key);
	var notifyParent = new Notification("Reward Requested", rewardName, chld.id, chld.key, sNotKey);
	sNotKey++;

	prnt.addNotification(notifyParent);

    context.child = chld.name;
    context.task = chld.taskList;
    context.notification = chld.notList;
    context.points = chld.points;
    context.rewards = chld.rewardList;

    res.render('childHome', context);
});

app.post('/createParent', function(req, res, next){
	//TODO: make sure passwords are the same
	var context = {};
	res.render('createParent', context);
	});

app.post('/createChild', function(req, res, next){
	var context = {};
	res.render('createChild', context);
	});

app.post('/createTask', function(req, res, next){
    var context = {};
    var add = req.body.addTaskHistory;
    var checkbox = req.body.mandatory;
    var taskVal = req.body.taskValue;
    var child = findChild(req.body.childSelect);
    var prt = findParent(child.key);
	var newTask = new Task(req.body.taskName, "11/2/2000", checkbox, prt.key, child.id, sTaskKey, taskVal);
	sTaskKey++;
	var newNot = new Notification("New Task", req.body.taskName, child.id, prt.id, sNotKey);
	sNotKey++;
	child.addNotification(newNot);
    if(checkbox !== 'mandatory'){
        checkbox = "optional";
    }
    if(add == 'addTask'){
        prt.addTaskHistory(newTask);
    }
    child.addTask(newTask);
    // console.log(child.taskList);
	taskList.push(newTask);
	storeTasks();
	context.parent = prt.name;
	context.child = prt.childList;
    context.task = prt.pendingTasks;
	context.msg = "Task, " + req.body.taskName + ", created.";
    res.render('parentHome', context);
});

app.post('/approveTask', function(req, res, next){
	var context = {};
	var prntObj = findParent(loggedIn[0]);
	var taskID = req.body.pending;
	//console.log(taskID);
	var taskObj = prntObj.getPendingTask(taskID);
	//console.log(taskObj.name);
	var child = findChildbyID(taskObj.cID);
	
	//console.log(child.taskList);
	taskObj.isComplete = true;
	taskObj.isPending = false;
	prntObj.removePendingTask(taskObj.id);
	child.removeTask(taskObj.id);
	child.addPoints(taskObj.value);

    context.parent = prntObj.name;
    context.child = prntObj.childList;
    context.notification = prntObj.notList;
    context.task = prntObj.pendingTasks;
    //console.log(prntObj.pendingTasks);

    res.render('parentHome', context);

});

app.post('/removeNotificationChild', function(req, res, next){
	var context = {};
	console.log(req.body.notID);
	var chldObj = findChildbyID(childLoggedIn[0]);
	for (var i = 0; i < req.body.notID.length; i++){
		//trace
		console.log(req.body.notID[i]);
		var notifID = req.body.notID[i];
		chldObj.removeNotification(notifID);
	}
	context.child = chldObj.name;
	context.task = chldObj.taskList;
	context.notification = chldObj.notList;
    context.points = chldObj.points;
	context.rewards = chldObj.rewardList;
	
	res.render('childHome', context);
});

app.post('/pendingTasks', function(req, res, next){
	var context = {};
	console.log(req.body.taskID);
	var chldObj = findChildbyID(childLoggedIn[0]);
	var taskObj;
	for (var i = 0; i < req.body.taskID.length; i++){
		//trace
		console.log(req.body.taskID[i]);
		var taskID = req.body.taskID[i];
		taskObj = chldObj.findTask(taskID);
		if (taskObj != null && !taskObj.isPending){
			var prntObj = findParent(chldObj.key);
			taskObj.isPending = true;
			var newNot = new Notification("Task pending", taskObj.name, chldObj.id, prntObj.key, sNotKey);
			sNotKey++;
			prntObj.addNotification(newNot);
			prntObj.addPendingTask(taskObj);
			chldObj.addCompletedTasks(taskObj);
		}
	}
	context.child = chldObj.name;
	context.task = chldObj.taskList;
	context.notification = chldObj.notList;
	context.points = chldObj.points;
	context.rewards = chldObj.rewardList;

	
	res.render('childHome', context);
});


app.post('/removeNotificationParent', function(req, res, next){
	var context = {};
	console.log(req.body.notID);
	var prntObj = findParent(loggedIn[0]);
	for (var i = 0; i < req.body.notID.length; i++){
		//trace
		console.log(req.body.notID[i]);
		var notifID = req.body.notID[i];
		prntObj.removeNotification(notifID);
	}
	context.parent = prntObj.name;
	context.child = prntObj.childList;
	context.notification = prntObj.notList;
    context.task = prntObj.pendingTasks;

	
	res.render('parentHome', context);
});


app.post('/registerParent', function(req, res, next){
	var pass1 = req.body.password1;
	var pass2 = req.body.password2;
	var context = {};
	if (pass1 != pass2){
		context.msg = "Passwords do not match";
		res.render('createParent', context);
	}
	else{
		var newParent = new Parent(req.body.username, req.body.password1, sKey);
		context.key = sKey;
		sKey++;
		parentList.push(newParent);
		storeParents();
		res.render('registerParent', context);
		//return res.redirect('/parentHome');
	}
	});

app.post('/registerChild', function(req, res, next){
	var context = {};
	var prnt = findParent(req.body.key);
	if (typeof prnt !== 'undefined'){
		var newChild = new Child(req.body.username, req.body.password1, req.body.key, sChldKey);
		childList.push(newChild);
		prnt.addChild(newChild);
		context.msg = "Parent found, account created!";
		
	}
	else {
		context.msg = "Parent not found, check for correct key!";
	}
	res.render('registerChild', context);
	});

app.post('/reward', function (req, res, next) {
	var context = {};
	var prntObj = findParent(loggedIn[0]);
	context.parent = prntObj.name;
	context.reward = prntObj.rewardList;

	res.render('approveRewards', context);
	});

app.post('/updateReward', function(req,res,next){
	var context = {};
	var prnt = findParent(loggedIn[0]);
	context.parent = prnt.name;
	context.notification = prnt.notList;
	context.child = prnt.childList;
    context.task = prnt.pendingTasks;
	var rwrdObj;
	for(var i =0; i<prnt.rewardList.length;i++){
		if(prnt.rewardList[i].name === req.body.rewards){
			rwrdObj = prnt.rewardList[i];
			rwrdObj.val = req.body.rewardValue;
		}
	}


	console.log(rwrdObj.val);
	if(req.body.approveReward === 'approved'){
		//Approved
		//var chld = findChildbyID(rwrdObj.cId);
	}else {
		//Disapproved
	}

	res.render('parentHome', context);
	});

app.post('/task', function(req, res, next) {
    var context = {};
    var prntKey = getKey(req.body.username);
    if (prntKey === -1) {
        context.msg = "Cannot find parent, account doesn't exist";
        res.render('parentHome', context);
    }
    else {

        var prntObj = findParent(prntKey);
        context.parent = prntObj.name;
        context.selection = prntObj.childList;
//console.log(context);
		console.log(prntObj.childList);
        res.render('createTask', context);
}});

//route to display previous tasks
app.get('/previousTasks', function(req, res, next){
	var context = {};
	//trace
	//console.log(loggedIn[0]);
	var prntObj = findParent(loggedIn[0]);
	//var taskObj = getTask(loggedIn[0]);
	context.parent = prntObj.name;
        context.selection = prntObj.childList;
	context.tasks = prntObj.taskHistoryList;
	//console.log(prntObj.taskHistoryList);
	res.render('previousTasks', context);
});

//reactivates task
app.post('/reactivateTask', function(req,res,next){
	var context = {};
	console.log(req.body);
	console.log(req.body.taskHistory);
	console.log(taskList);
	var taskObj = findTask(req.body.taskHistory);
	context.name = taskObj.name;
	//find task, switch isComplete to false
	//find child
	context.cName = req.body.childSelect;
	var childObj = findChild(context.cName);
	if (taskObj.isComplete){
		context.msg = "Task, " + taskObj.name + ", reactivated for child, " + context.cName + ".";
		taskObj.isComplete = false;
		childObj.addTask(taskObj);
		//trace
		//console.log(childObj.taskList);
		//console.log(childObj.notList);
		var not = new Notification("New task", taskObj.name, childObj.id, loggedIn[0], sNotKey);
		sNotKey++;
		childObj.addNotification(not);
		//trace
		//console.log(childObj.taskList);
		//console.log(childObj.notList);
	}
	else{
		context.msg = "Task is already active.";
	}
	var prntObj = findParent(loggedIn[0]);
	context.parent = prntObj.name;
	context.child = prntObj.childList;
    context.task = prntObj.pendingTasks;
    context.notification = prntObj.notList;

	res.render('parentHome', context);
	
});

app.get('/parentHome', function(req, res, next){
    var context = {};
    var prntKey = getKey(req.body.username);
    if (prntKey === -1) {
        //context.msg = "Cannot find parent, account doesn't exist";
        res.redirect('/');
    }
    else{
        var prntObj = findParent(prntKey);
        context.parent = prntObj.name;
		context.child = prntObj.childList;
		context.notification = prntObj.notList;
		context.task = prntObj.pendingTasks;
		console.log(prntObj.pendingTasks);
        //context.task = prntObj.childList[0].taskList;
        res.render('parentHome', context);
    }});

app.get('/childHome', function(req, res, next){
    var context = {};
	var chldObj = findChild(req.body.username);
    if(chldObj  != null) {
		context.child = chldObj.name;
		context.task = chldObj.taskList;
		context.notification = chldObj.notList;
		context.rewards = chldObj.rewardList;
		console.log(chldObj.notList);
        res.render('childHome', context);
    } else{
    	res.redirect('/');
	}
    });

//app.get('/createTask', function(req, res, next){
//	var context = {};
	//var parentObj = findParent(123);
	//context.name = parentObj.name;
	//res.render('createTask', context);
	//});

//TODO: app.post('/login')
// form data username and password sent by POST

app.use(function(req, res){
	res.status(404);
	res.render('404');
});

app.use(function(err, req, res, next){
	console.error(err.stack);
	res.type('plain/text');
	res.status(500);
	res.render('500');
});

app.listen(app.get('port'), function(){
	console.log('Express started on port:' + app.get('port') + '; Press Ctrl + C to terminate.');
});

//On CTRL + C store parents and children and exit
process.on('SIGINT', function(){
	storeParents();
	storeChildren();
	process.exit();
});
