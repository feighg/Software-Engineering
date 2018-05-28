var serverURL = 'http://flip3.engr.oregonstate.edu:51413';
//TODO: getTableData()

var mysqlData = {
	row1: [0,15, 35, '2000-06-17', 1],
	row2: [1, 8, 23, '2000-06-18', 1],
	row3: [2, 12, 54, '2000-06-19', 1]
};

function getTableData(){
	//TODO
}


//TODO: buildTable after MySQL call
//buildTable(mysqlData);

function getTable(){
	var req = new XMLHttpRequest();
	req.open('GET', serverURL + '/get-table', true);
	req.addEventListener('load', function(){
		if (req.status >= 200 && req.status < 400){
			buildTable(req.responseText);
		}
	});
	req.send();
}

function buildTable(response){
	var tableData = JSON.parse(response);
	console.log(tableData);
	var table = document.createElement('table');
	table.id = 'docTable';
	table.style.border = 'thin solid black';
	document.body.appendChild(table);
	var row = document.createElement('TR');
	row.id = 'tableHeader';
	table.appendChild(row);
	var col = document.createElement('TH');
	col.textContent = 'Name';
	row.appendChild(col);
	col = document.createElement('TH');
	col.textContent = 'Reps';
	row.appendChild(col);
	col = document.createElement('TH');
	col.textContent = 'Weight';
	row.appendChild(col);
	col = document.createElement('TH');
	col.textContent = 'Date';
	row.appendChild(col);
	col = document.createElement('TH');
	col.textContent = 'lbs';
	row.appendChild(col);
	col = document.createElement('TH');
	col.textContent = 'Modify Row';
	col.style.colspan = 2;
	row.appendChild(col);
	//console.log(JSON.stringify(tableData));
	for (var pos in tableData){
		var elem = tableData[pos];
		console.log(elem);
		console.log(elem.name);
		//console.log(elem);
		//console.log(tableData[elem]);
		row = document.createElement('TR');
		row.id = 'row' + elem.id;
		row.value = elem.id;
		table.appendChild(row);

		var col = document.createElement('TD');
		col.textContent = elem.name;
		col.value = elem.name;
		col.class = 'bordered';
		row.appendChild(col);

		col = document.createElement('TD');
		col.textContent = elem.reps;
		col.value = elem.reps;
		col.class = 'bordered';
		row.appendChild(col);
		
		col = document.createElement('TD');
		col.textContent = elem.weight;
		col.value = elem.weight;
		col.class = 'bordered';
		row.appendChild(col);
		
		col = document.createElement('TD');
		var dateOnly = elem.date.split('T');
		col.textContent = dateOnly[0];
		col.value = dateOnly[0];
		col.class = 'bordered';
		row.appendChild(col);
		
		col = document.createElement('TD');
		col.textContent = elem.lbs;
		col.value = elem.lbs;
		col.class = 'bordered';
		row.appendChild(col);	

		var update = document.createElement('button');
		update.textContent = 'Edit';
		row.appendChild(update);
		addClickUpdate(update, elem.id);
		var remove = document.createElement('button');
		remove.textContent = 'Delete';
		addDelete(remove, elem.id);
		row.appendChild(remove);
	}
}

function editRow(id){
	var editDiv = document.getElementById('updateDiv');
	editDiv.style.display = 'block';
	var row = document.getElementById('row' + id);
	var childList = row.childNodes;
	var formNodes = document.getElementById('updateData').getElementsByTagName('input');
	for (var i = 0; i < formNodes.length;i++){
		formNodes[i].value = childList[i].textContent;
	}
	var dataID = document.getElementById('hiddenUpdate');
	dataID.value = id;
	//console.log(id);
}
function updateRowClient(){
	var id = document.getElementById('hiddenUpdate').value;
	var formNodes = document.getElementById('updateData').getElementsByTagName('input');
	var row = document.getElementById('row' + id);
	var childList = row.childNodes;
	for (var i = 0; i < formNodes.length; i++){
		childList[i].textContent = formNodes[i].value;
	}
	document.getElementById('updateDiv').style.display = 'none';
}
function updateRow(){
	//TODO: add MySQL Call
	var dataObj = [];
	var row = document.getElementById('updateData');
	var inputs = row.getElementsByTagName('input');
	for (var i = 0; i < inputs.length; i++){
		dataObj.push(inputs[i].value);
	}
	dataObj.push(document.getElementById('hiddenUpdate').value);
	var req = new XMLHttpRequest();	
	var url = serverURL + '/update?name=' + dataObj[0] +
	       '&reps=' + dataObj[1] +
		'&weight=' + dataObj[2] +
		'&date=' + dataObj[3] +
		'&lbs=' + dataObj[4] + 
		'&id=' + dataObj[5];
	console.log(url);
	req.open('GET', url, true);
	req.addEventListener('load', function(){
		if (req.status >= 200 && req.status < 400){
			updateRowClient(dataObj, req.responseText);
		}
	});
	req.send();
	event.preventDefault();
}

function addClickUpdate(elem, id){
	elem.addEventListener('click', function(){
		editRow(id);
	});
}

function addDelete(elem, id){
	elem.addEventListener('click', function(){
		deleteRow(id);
	});
}

function deleteRow(id){
	event.preventDefault();
	//TODO: MySQL call before this function
	var req = new XMLHttpRequest();	
	var url = serverURL + '/delete?id=' + id; 
	console.log(url);
	req.open('GET', url, true);
	req.addEventListener('load', function(){
		if (req.status >= 200 && req.status < 400){
			deleteRowClient(id);
		}
	});
	req.send();
}

function deleteRowClient(id){
	var row = document.getElementById('row' + id);
	var table = document.getElementById('docTable');
	while (row.hasChildNodes()){
		row.removeChild(row.lastChild);	event.preventDefault();
	}
	table.removeChild(row);
}

function bindButtons(){
	var updateButton = document.getElementById('updateSubmit');
	updateButton.addEventListener('click', updateRow);
	var addButton = document.getElementById('submitAdd');
	addButton.addEventListener('click', addRow);
}

function getAddData(){
	//TODO: turn this into MySQL call
	var formElements = document.getElementById('addData').getElementsByTagName('input');
	var dataObj = [];
	for (var i = 0; i < formElements.length; i++){
		dataObj.push(formElements[i].value);
	}
	return dataObj;
}

function addRow(){
	event.preventDefault();
	//TODO: MySQL call before this function
	var dataObj = getAddData();
	var req = new XMLHttpRequest();	
	var url = serverURL + '/insert?name=' + dataObj[0] +
	       '&reps=' + dataObj[1] +
		'&weight=' + dataObj[2] +
		'&date=' + dataObj[3] +
		'&lbs=' + dataObj[4];
	console.log(url);
	req.open('GET', url, true);
	req.addEventListener('load', function(){
		if (req.status >= 200 && req.status < 400){
			addRowClient(dataObj, req.responseText);
		}
	});
	req.send();

}

function addRowClient(mysqlData, res){
	console.log(res);
	event.preventDefault();
	//TODO: MySQL call before this function
	var data = getAddData();
	var row = document.createElement('TR');
	var mysqlid = res; //TODO: remove this
	console.log(res);
	row.id = 'row' + mysqlid;
	row.value = mysqlid;
	var table = document.getElementById('docTable');
	table.appendChild(row);
	for (var i = 0; i < data.length; i++){
		var col = document.createElement('TD');
		col.textContent = data[i];	
		col.class = 'bordered';
		row.appendChild(col);
	}
	var update = document.createElement('button');
	update.textContent = 'Edit';
	row.appendChild(update);
	addClickUpdate(update, mysqlid);
	var remove = document.createElement('button');
	remove.textContent = 'Delete';
	addDelete(remove, mysqlid);
	row.appendChild(remove);
}
