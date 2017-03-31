function getUniqueId(){
	return (new Date() * 1).toString(32);
};

function createDbConnection(){
	return require('mysql').createConnection({
		host     : 'localhost',
		user     : 'root',
		password : '',
		database : 'sgb',
	});
}	

exports.getUniqueId = getUniqueId;
exports.createDbConnection = createDbConnection;