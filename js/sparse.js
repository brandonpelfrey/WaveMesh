function SparseMatrix(M,N) {
	this.M = M;
	this.N = N;
	this.rowData = new Array(M);

	var i;
	for(i=0;i<M;++i) {
		this.rowData[i] = [];
	}

	this.accumulate = function(i,j,val) {
		// see if there is an entry already
		var k, data=this.rowData[i];
		for(k=0;k<data.length;++k) {
			if(data[k][0] === j) {
				data[k][1] += val;
				return;
			}
		}
		// didn't exist
		data.push([j,val]);
	};

	this.set = function(i,j,val) {
		// see if there is an entry already
		var k, data=this.rowData[i];
		for(k=0;k<data.length;++k) {
			if(data[k][0] === j) {
				data[k][1] = val;
				return;
			}
		}
		// didn't exist
		data.push([j,val]);
	};

	this.get = function(i,j) {
		// see if there is an entry already
		var k, data=this.rowData[i];
		for(k=0;k<data.length;++k) {
			if(data[k][0] === j) {
				return data[k][1];
			}
		}
		// didn't exist
		return 0.0;
	};

	this.getNumeric = function() {
		// This is slow and dumb, but makes this really nice for interacting
		var rows = [], cols = [], elements = [], i, j, data;

		for(i=0;i<this.M;++i) {
			data = this.rowData[i];
			for(j=0;j<data.length;++j) {
				rows.push(i);
				cols.push(data[j][0]);
				elements.push(data[j][1]);
			}
		}
		return numeric.ccsScatter([rows, cols, elements]);
	};
}