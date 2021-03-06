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

	this.normalizeRows = function() {
		// see if there is an entry already
		var i,k,data, sum;
		for(i=0;i<this.M;++i) {
			data = this.rowData[i];
			sum = 0.0;
			for(k=0;k<data.length;++k) {
				sum += Math.abs(data[k][1]);
			}	
			if(sum != 0.0) {
				sum = 1.0 / sum;
				for(k=0;k<data.length;++k) {
					data[k][1] *= sum;
				}	
			}
		}
	};

	this.getNumeric = function() {
		// This is slow and dumb, but makes this really nice for interacting with numericjs
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

	this.multiply = function(v) {
		var result = new Array(this.M), i, j, data, sum, L;
		for(i=0;i<this.M;++i) {
			data = this.rowData[i];
			sum = 0.0;
			L = data.length;
			for(j=0;j<L;++j) {
				sum += v[data[j][0]] * data[j][1];
			}
			result[i] = sum;
		}
		return result;
	}

	// in-place
	this.scale = function(s) {
		var i,j;
		for(i=0;i<this.M;++i) {
			data = this.rowData[i];
			for(j=0;j<data.length;++j) {
				data[j][1] *= s;
			}
		}
	}

	this.add = function(B) {
		var result = new SparseMatrix(this.M, this.N), i, j;
		// Add A
		for(i=0;i<this.M;++i) {
			data = this.rowData[i];
			for(j=0;j<data.length;++j) {
				result.accumulate(i, data[j][0], data[j][1]);
			}
		}
		// Add B
		for(i=0;i<this.M;++i) {
			data = B.rowData[i];
			for(j=0;j<data.length;++j) {
				result.accumulate(i, data[j][0], data[j][1]);
			}
		}
		return result;
	}
}