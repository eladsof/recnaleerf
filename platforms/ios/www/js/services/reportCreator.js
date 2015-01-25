/**
 * Created by eladsof on 10/5/14.
 */
angular.module('reportCreator',[])
    .service("reportCreator", ['$filter','Customer',


        function($filter,Customer) {
            var title = "";
            var doc;
            var pageYindex = 80;

            function getDoc() {
                var dd = {
                    header : function(pageNum,totalPages) {return {style: 'header', text: 'Report from recnaleerf - Page ' + pageNum + 'out of '+totalPages}},

                    content: [],

                    styles: {

                        header: {
                            fontSize: 18,
                            bold: true,
                            color: 'grey',
                            margin: [40, 10, 10, 60]
                        },

                        subheader: {
                            fontSize: 16,
                            bold: true,
                            margin: [0, 0, 0, 10]
                        },

                        tableExample: {
                            margin: [0, 0, 0, 0]
                        },

                        tableHeader: {
                            bold: true,
                            fontSize: 13,
                            color: 'black'
                        }
                    },
                    defaultStyle: {
                        // alignment: 'justify'
                    }
                };
                return dd;
            }

            this.generateReportMail = function (atitle, workitems) {
                doc = getDoc();
                createContent(atitle,workitems);
                sendAsAttachement();
            };

            var createContent = function (title, workitems) {
                addTitle(title);
                addReportBody(workitems);
            };

            var addTitle = function (atitle) {
                doc.content.push({style: 'subheader', text: atitle});
            };

            var addReportBody = function (workitems) {
                var groupedByCustomer = _.groupBy(workitems,function(item) {return item.customer.id});
                _.forEach(groupedByCustomer,addCustomerTable);
            };

            var addCustomerTable = function(items,customerId) {
                createTableTitle(items[0].customer.name);
                createTable(items);
            };

            var createTableTitle = function (customerName) {
                var tableTitle = 'Summary for '+ customerName;
                doc.content.push('\n\n');
                doc.content.push({style: 'subheader', text: tableTitle});
            };

            function createTable(items) {
                var totalSum = 0;
                var tableObj = getTableHeader();
                for(var index in items){
                    tableObj.table.body.push(convertDataToTableModel(items[index]));
                    totalSum += items[index].totalCharge();
                }
                doc.content.push(tableObj);
                addTableFooter(totalSum);
            }

            var addTableFooter = function (sum) {
                doc.content.push('\n');
                var tableTitle = 'Total to charge is : '+ sum;
                doc.content.push({style: 'subheader', text: tableTitle});
            };

            function getTableHeader() {
                return {table: {
                    body: [[{style: 'tableHeader', text: 'Date'},
                            {style: 'tableHeader', text: 'Start'},
                            {style: 'tableHeader', text: 'Total time'},
                            {style: 'tableHeader', text: 'Price per hour'},
                            {style: 'tableHeader', text: 'Total'}]]}};
            }

            function convertDataToTableModel(item) {
                console.log(item.rate);
                return [ $filter('date')(item.start,'shortDate'),
                        $filter('date')(item.start,'shortTime'),
                        item.formattedElapsedTime(),
                        String(item.rate),
                        $filter('number')(item.totalCharge(),1)
                        ];
            }

            var sendAsAttachement = function () {
                //pdfMake.createPdf(doc).open();
                //return;

                var pdf = pdfMake.createPdf(doc);
                window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {

                        fileSystem.root.getFile("test.pdf", {create: true}, function(entry) {
                            var fileEntry = entry;

                            entry.createWriter(function(writer) {
                                writer.onwrite = function(evt) {
                                    console.log("write success");
                                };

                                pdf.getBuffer(function(result){
                                    writer.write( new Blob([result], {type: 'application/pdf'}) );
                                    var path =  fileEntry.toURL();
                                    sendMailWithAttachement(title,path);
                                })

                            }, function(error) {
                                navigator.notification.alert(error, null, "Error in report");
                            });

                        }, function(error){
                            navigator.notification.alert(error, null, "Error in report");
                        });
                    },
                    function(event){
                        console.log( evt.target.error.code );
                    });
            };

            var sendMailWithAttachement = function (title,attachementPath) {
                window.plugin.email.open({
                    subject: title,
                    body:    'Attached you can find:  <br>' + this.title,
                    attachments: [attachementPath]
                });
            };
            
           
            return this;
        }
    ]);