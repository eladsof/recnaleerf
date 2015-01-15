/**
 * Created by eladsof on 10/5/14.
 */
angular.module('reportCreator',[])
    .service("reportCreator", ['$filter',


        function($filter) {
            this.title = "";
            var doc;

            this.generateReportMail = function (title, workitems) {
                doc = new jsPDF('p', 'pt', 'letter');
                this.title = title;
                createContent(title,workitems);
                sendAsAttachement(title,doc.output());
            };

            var createContent = function (title, workitems) {
                addTitle(title);
                addReportHeader();
                addReportBody(workitems);
                addReportFooter();
            };

            var addTitle = function (title) {
                //doc.text(20, 20, title);
            };

            var addReportHeader = function () {
                // Add header of some sort if needed
            };

            var addReportBody = function (workitems) {

                var groupedByCustomer = _.groupBy(workitems,function(item) {return item.customer.id});
                _.forEach(groupedByCustomer,addCustomerTable);
                //console.log(groupedByCustomer);

                //doc.autoTable(columns, workitems, {});
            };

            var createTableTitle = function (items, customerId) {
                doc.text(20,20,'This is the table title - How `bout that ;)');
            };

            function getTableHeader() {
                return [
                    {title: "Date", key: "date"},
                    {title: "Start", key: "start"},
                    {title: "Total time", key: "totalTime"},
                    {title: "Price per hour", key: "rate"},
                    {title: "Total", key: "totalSum"}
                ];
            }

            function convertDataToTableModel(items) {
                return _.map(items,function(item) {
                        return {date: $filter('date')(item.start,'shortDate'),
                                start: $filter('date')(item.start,'shortTime'),
                                totalTime:item.formattedElapsedTime(),
                                rate:item.rate,
                                totalSum:$filter('number')(item.totalCharge(),1)
                        }
                    }
                );
            }

            function createTable(items) {
                var header = getTableHeader();
                var data = convertDataToTableModel(items);
                doc.autoTable(header, data, {});
            }

            var addCustomerTable = function(items,customerId) {
                createTableTitle(items,customerId);
                createTable(items);
                doc.addPage();
            };

            var addReportFooter = function () {
                // Add footer of some sort if needed
            };


            var sendAsAttachement = function (title,pdfDoc) {
                doc.save();
                /*window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {

                        fileSystem.root.getFile("test.pdf", {create: true}, function(entry) {
                            var fileEntry = entry;

                            window.alert(title);
                            entry.createWriter(function(writer) {
                                writer.onwrite = function(evt) {
                                    console.log("write success");
                                };

                                writer.write( pdfDoc );
                                var path =  fileEntry.toURL();
                                //path = path.replace('file\:\/\/', 'relative://');

                                sendMailWithAttachement(title,path);
                            }, function(error) {
                                navigator.notification.alert(error, null, "Error in report");
                            });

                        }, function(error){
                            navigator.notification.alert(error, null, "Error in report");
                        });
                    },
                    function(event){
                        console.log( evt.target.error.code );
                    });*/
            };

            var sendMailWithAttachement = function (title,attachementPath) {
            		alert('hhheeeelllloooooo');
                navigator.notification.alert(title + "    " + attachementPath, null, "DEBUG");
                window.plugin.email.open({
                    subject: title,
                    body:    'Attached you can find:  <br>' + this.title,
                    attachments: [attachementPath]
                });
            };
            
           
            return this;
        }
    ]);