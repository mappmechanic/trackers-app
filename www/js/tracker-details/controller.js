var trackerDetailsModule = angular.module('TrackerDetails',['ngCordova']);

trackerDetailsModule.controller('TrackerDetailsCtrl',['$scope','$stateParams','$cordovaSQLite','$ionicPlatform','TrackerService','TrackersService',
	function($scope,$stateParams,$cordovaSQLite,$ionicPlatform,TrackerService,Trackers){

		initData();
		initMethods();

		function initData(){
			$scope.newEntry = {
				value: 0
			};
			$scope.loadingEntries = false;
			$scope.shouldShowDelete = false;
			$scope.editButtonLabel = "Edit";
			$scope.trackerId = $stateParams['id'];
			$scope.trackerInfo = Trackers.getTracker($scope.trackerId);
			TrackerService.initDB();
			fetchEntries();
		}

		function initMethods() {
			$scope.addNewEntry = addNewEntry;
			$scope.toggleEdit = toggleEdit;
			$scope.deleteEntry = deleteEntry;
		}

		function fetchEntries() {
			$scope.loadingEntries = true;
			TrackerService.getAllEntries($scope.trackerId)
			.then(fetchEntriesSuccessCB,fetchEntriesErrorCB);
		}

		function toggleEdit() {
			$scope.shouldShowDelete = !$scope.shouldShowDelete;
			$scope.editButtonLabel = $scope.shouldShowDelete ? "Done" : "Edit";
		}

		function addNewEntry()
		{
			if($scope.newEntry.value!= '' && $scope.newEntry.value > 0){
				TrackerService.addNewEntry($scope.trackerId,$scope.newEntry.value)
				.then(function(response){
					$scope.newEntry.value = 0;
					alert("New Entry has been added.");
					fetchEntries();
				},function(error){
					alert("Error in adding new entry");
				});
			}else
			{
				alert('Please enter a positive value.');
			}
		}

		function fetchEntriesSuccessCB(response)
		{
			$scope.loadingTrackers = false;
			if(response && response.rows && response.rows.length > 0)
			{
				console.log(response.rows.length)
				$scope.entriesList = [];

				for(var i=0;i<response.rows.length;i++)
				{
					$scope.entriesList.push({
						id:response.rows.item(i).id,
						value:response.rows.item(i).value,
						created_at:response.rows.item(i).created_at
					});
				}
			}else
			{
				$scope.message = "No entries created till now.";
			}
		}

		function fetchEntriesErrorCB(error)
		{
			$scope.loadingTrackers = false;
			$scope.message = "Some error occurred in fetching Trackers List";
		}

		function deleteEntry(index,id)
		{
			if(index > -1)
			{
				TrackerService.deleteEntry(id)
				.then(function(response){
					$scope.entriesList.splice(index,1);
					alert("Entry has been succesfully deleted.");
				},function(error){
					alert("Error in adding new entry");
				});
			}
		}
}]);
