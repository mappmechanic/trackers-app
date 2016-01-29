var trackersListModule = angular.module('TrackersList');

trackersListModule.factory('TrackersService',['$cordovaSQLite','$ionicPlatform','$q',
	function($cordovaSQLite,$ionicPlatform,$q){
		var db;
		var trackersList;
		return {
			initDB:initDB,
			getAllTrackers: getAllTrackers,
			addNewTracker: addNewTracker,
			deleteTracker: deleteTracker,
			getTracker:getTracker
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
			  
			   var query = "CREATE TABLE IF NOT EXISTS trackers_list (id integer autoincrement primary key, name string , no_of_entries integer)";
			    runQuery(query,[],function(res) {
			      console.log("table created ");
			    }, function (err) {
			      console.log(err);
			    });
		  }.bind(this));
		}

		function getAllTrackers(){
			var deferred = $q.defer();
			var query = "SELECT * from trackers_list";
			runQuery(query,[],function(response){
				//Success Callback
				console.log(response);
				trackersList = response.rows;
				deferred.resolve(response);
			},function(error){
				//Error Callback
				console.log(error);
				deferred.reject(error);
			});

			return deferred.promise;
		}

		function addNewTracker(name) {
			console.log('adding new tracker :'+name);
			var deferred = $q.defer();
			var query = "INSERT INTO trackers_list (name, no_of_entries) VALUES (?,?)";
			runQuery(query,[name,0],function(response){
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

		function deleteTracker(id) {
			var deferred = $q.defer();
			var query = "DELETE FROM trackers_list WHERE id = ?";
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

		function getTracker(id) {
			var tracker;
			if(trackersList){
				for(var i=0;i<trackersList.length;i++)
				{
					if(trackersList.item(i).id == id)
						tracker = trackersList.item(i);
				}
			}
			return tracker;
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