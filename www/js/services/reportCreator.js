/**
 * Created by eladsof on 10/5/14.
 */
angular.module('reportCreator',[])
    .service("reportCreator", ['$filter','Customer',


        function($filter,Customer) {
            var title = "";
            var doc;
            var pageYindex = 70;
            var firstPage;

            this.generateReportMail = function (atitle, workitems) {
                doc = new jsPDF('p', 'pt', 'letter');
                firstPage = true;
                title = atitle;
                createContent(title,workitems);
                sendAsAttachement(title,doc.output());
            };

            var createContent = function (title, workitems) {

                addReportHeader();
                addTitle(title);
                addReportBody(workitems);
                addReportFooter();
            };

            var addReportHeader = function () {

            };

            var addTitle = function (atitle) {
                doc.setFont('Helvetica','Bold');
                doc.setFontSize(30);
                var updatedTitle = doc.splitTextToSize(atitle,600);
                doc.text(20,pageYindex,updatedTitle);
                pageYindex += 70;
            };

            var addReportBody = function (workitems) {

                var groupedByCustomer = _.groupBy(workitems,function(item) {return item.customer.id});
                _.forEach(groupedByCustomer,addCustomerTable);
            };

            function needToAddPage() {
                var temp = firstPage;
                firstPage = false;
                return temp;;
            }

            var addCustomerTable = function(items,customerId) {
                if(needToAddPage())
                    doc.addPage();
                createTableTitle(items[0].customer.name);
                createTable(items);
                pageYindex = 20;
            };

            var createTableTitle = function (customerName) {
                var tableTitle = 'Summary for '+ customerName;
                console.log(tableTitle);
                doc.setFontSize(16);
                doc.text(20,pageYindex,tableTitle);
                pageYindex+=30;
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
                var options = {
                    padding: 3, // Vertical cell padding
                    fontSize: 12,
                    lineHeight: 18,
                    margins: { horizontal: 40, top: pageYindex, bottom: 10 },// How much space around the table
                    extendWidth: true // If true, the table will span 100% of page width minus horizontal margins.
                };

                var header = getTableHeader();
                var data = convertDataToTableModel(items);
                doc.autoTable(header, data, options);
            }

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