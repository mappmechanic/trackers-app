var trackersListModule = angular.module('TrackersList',['ngCordova']);

trackersListModule.controller('TrackersListCtrl',['$scope','$cordovaSQLite','$ionicPlatform','TrackersService',
	function($scope,$cordovaSQLite,$ionicPlatform,TrackersService){

		initData();
		initMethods();

		function initData(){
			$scope.newTracker = {
				name: ''
			};
			$scope.loadingTrackers = false;
			$scope.shouldShowDelete = false;
			$scope.editButtonLabel = "Edit";
			TrackersService.initDB();
			fetchTrackers();
		}

		function initMethods() {
			$scope.addNewTracker = addNewTracker;
			$scope.toggleEdit = toggleEdit;
			$scope.deleteTracker = deleteTracker;
		}

		function fetchTrackers() {
			$scope.loadingTrackers = true;
			TrackersService.getAllTrackers()
			.then(fetchTrackerListSuccessCB,fetchTrackerListErrorCB);
		}

		function toggleEdit() {
			$scope.shouldShowDelete = !$scope.shouldShowDelete;
			$scope.editButtonLabel = $scope.shouldShowDelete ? "Done" : "Edit";
		}

		function addNewTracker()
		{
			if($scope.newTracker.name != '' && $scope.newTracker.name.length > 0){
				TrackersService.addNewTracker($scope.newTracker.name)
				.then(function(response){
					$scope.newTracker.name = '';
					alert("New Tracker has been added.");
					fetchTrackers();
				},function(error){
					alert("Error in adding new trakcer");
				});
			}else
			{
				alert('Please enter the name of the tracker.');
			}
		}

		function fetchTrackerListSuccessCB(response)
		{
			$scope.loadingTrackers = false;
			if(response && response.rows && response.rows.length > 0)
			{
				$scope.trackersList = [];
				for(var i=0;i<response.rows.length;i++)
				{
					$scope.trackersList.push({id:response.rows.item(i).id,name:response.rows.item(i).name});
				}
			}else
			{
				$scope.message = "No trackers created till now.";
			}
		}

		function fetchTrackerListErrorCB(error)
		{
			$scope.loadingTrackers = false;
			$scope.message = "Some error occurred in fetching Trackers List";
		}

		function deleteTracker(index,id)
		{
			if(index > -1)
			{
				TrackersService.deleteTracker(id)
				.then(function(response){
					$scope.trackersList.splice(index,1);
					alert("Tracker has been succesfully deleted.");
				},function(error){
					alert("Error in adding new trakcer");
				});
			}
		}
}]);
