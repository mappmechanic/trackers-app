var trackerDetailsModule = angular.module('TrackerDetails');

trackerDetailsModule.factory('TrackerService',['$cordovaSQLite','$ionicPlatform','$q',
	function($cordovaSQLite,$ionicPlatform,$q){
		var db;
		return {
			initDB:initDB,
			getAllEntries: getAllEntries,
			addNewEntry: addNewEntry,
			deleteEntry: deleteEntry
		}

		function initDB() {
		  $ionicPlatform.ready(function() {
		  	//   if(window.cordova)
		  	//   {
			  // 	db = $cordovaSQLite.openDB("myapp.db");
			  // }else
			  // {
			  // 	db = window.openDatabase("myapp.db", '1.0', 'Trackers DB', -1);
			  // }
			  db = $cordovaSQLite.openDB("myapp.db");

			   var query = "CREATE TABLE IF NOT EXISTS tracker_entries (id integer autoincrement primary key, tracker_id integer , value real, created_at datetime)";
			    runQuery(query,[],function(res) {
			      console.log("table created ");
			    }, function (err) {
			      console.log(err);
			    });
		  }.bind(this));
		}

		function getAllEntries(trackerId){
			var deferred = $q.defer();
			var query = "SELECT * from tracker_entries WHERE tracker_id = ?";
			runQuery(query,[trackerId],function(response){
				//Success Callback
				console.log(response);
				deferred.resolve(response);
			},function(error){
				//Error Callback
				console.log(error);
				deferred.reject(error);
			});

			return deferred.promise;
		}

		function addNewEntry(trackerId,value) {
			var deferred = $q.defer();
			var query = "INSERT INTO tracker_entries (tracker_id, value,created_at) VALUES (?,?,datetime())";
			runQuery(query,[trackerId,value],function(response){
				//Success Callback
				console.log(response);
				deferred.resolve(response);
			},function(error){
				//Error Callback
				console.log(error);
				deferred.reject(error);
			});

			return deferred.promise;
		}

		function deleteEntry(id) {
			var deferred = $q.defer();
			var query = "DELETE FROM tracker_entries WHERE id = ?";
			runQuery(query,[id],function(response){
				//Success Callback
				console.log(response);
				deferred.resolve(response);
			},function(error){
				//Error Callback
				console.log(error);
				deferred.reject(error);
			});

			return deferred.promise;
		}

		function runQuery(query,dataArray,successCb,errorCb)
		{
		  $ionicPlatform.ready(function() {		  
			    $cordovaSQLite.execute(db, query,dataArray).then(function(res) {
			      successCb(res);
			    }, function (err) {
			      errorCb(err);
			    });
		  }.bind(this));
		}

	}
]);