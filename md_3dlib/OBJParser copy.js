OBJParser = function (text) {
	var vertexList = [];
	var uvList = [];
	var normalList = [];
	
	var vertices = [];
	var uvs = [];
	var normals = [];
	
	//Function to add vertex data
	var addFace = function (group) {
		var indeces = group.split("/");
		
		for (var i = 0; i < 3; i++) {
			var index = (parseInt(indeces[0]) - 1) * 3 + i;
			vertices.push(vertexList[index]);
		}
		for (var i = 0; i < 2; i++) {
			var index = (parseInt(indeces[1]) - 1) * 2 + i;
			uvs.push(uvList[index]);
		}
		for (var i = 0; i < 3; i++) {
			var index = (parseInt(indeces[2]) - 1) * 3 + i;
			normals.push(normalList[index]);
		}
	}

	var lines = text.split("\n");

	for (var i = 0; i < lines.length; i++) {
		var params = lines[i].split(" ");

		if (params[0] === "v") { //VERTEX
			for (var j = 1; j <= 3; j++) { vertexList.push(parseFloat(params[j])); }
		}
		
		if (params[0] === "vt") { //UV
			for (var j = 1; j <= 2; j++) { uvList.push(parseFloat(params[j])); }
		}
		
		if (params[0] === "vn") { //NORMAL
			for (var j = 1; j <= 3; j++) { normalList.push(parseFloat(params[j])); }
		}
		
		//FACE
		if (params[0] === "f") {
			for (var j = 1; j < params.length; j++) {
				//If this is the 4th vertex of a face, add the first and second to make a second triangle				
				if (j > 3) {
					addFace(params[1]);
					addFace(params[3]);
				}
				
				addFace(params[j]);
			}
		} 
	}
	
	return { positions: vertices, uvs: uvs, normals: normals };
};
