'use strict';

/**
 * @ngdoc function
 * @name recnaleerfClientApp.controller:UserCtrl
 * @description
 * # UserCtrl
 * Controller of the recnaleerfClientApp
 */

angular.module('recnaleerfClientApp')
    .controller('reportByDateCtrl', ['$scope','$stateParams','$window','WorkItem', 'Customer','$ionicLoading', function ($scope,$stateParams,$window,WorkItem,Customer,$ionicLoading) {

        $scope.customer = null;
        $scope.firstItemDate = new Date($stateParams.start);
        $scope.lastItemDate = new Date($stateParams.finish);
        $scope.workItems = null;
        $scope.totalItemsSum = 0;

        var createReport = function () {
            if($stateParams.customerid)
                createReportForCsutoemr();
            else
                getReportData();

        };

        var createReportForCsutoemr = function () {
            Customer.getById($stateParams.customerid).then(
                function(aCustomer) {
                    $scope.customer = aCustomer;
                    getReportData();
                });
        };

        var getReportData = function () {
            $ionicLoading.show();
            WorkItem.getByDateAndCustomer($scope.currentUser,$scope.customer,$scope.firstItemDate,$scope.lastItemDate).then(
                function (aItems) {
                    $scope.workItems = aItems;
                    $scope.totalItemsSum = 0;
                    calculateSum();
                    $ionicLoading.hide();
                });
        };

        var calculateSum = function () {
            $scope.workItems.forEach(function(item) {
                $scope.totalItemsSum += item.totalCharge();
            });
        };

        $scope.exportReport = function () {
            //FIRST GENERATE THE PDF DOCUMENT
            console.log("generating pdf...");
            var doc = new jsPDF();

            doc.text(20, 20, 'HELLO!');

            doc.setFont("courier");
            doc.setFontType("normal");
            doc.text(20, 30, 'This is a PDF document generated using JSPDF.');
            doc.text(20, 50, 'YES, Inside of PhoneGap!');

            var pdfOutput = doc.output();

            window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {

                    fileSystem.root.getFile("test.pdf", {create: true}, function(entry) {
                        var fileEntry = entry;

                        entry.createWriter(function(writer) {
                            writer.onwrite = function(evt) {
                                console.log("write success");
                            };

                            writer.write( pdfOutput );
                            var path =  fileEntry.toURL();
                            //path = path.replace('file\:\/\/', 'relative://');
                            window.alert(path);

                            try{
                            window.plugin.email.open({
                                to:      ['info@appplant.de'],
                                subject: 'Congratulations',
                                body:    '<h1>Happy Birthday!!!</h1>',
                                attachments: [path]
                            });
                            } catch(e) {
                                window.alert(e);
                            }
                            window.alert('done');
                        }, function(error) {
                            window.alert(error);
                        });

                    }, function(error){
                        window.alert(error);
                    });
                },
                function(event){
                    console.log( evt.target.error.code );
                });
        };


        createReport();

    }]);
