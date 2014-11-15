/**
 * Created by eladsof on 10/5/14.
 */
angular.module('reportCreator',[])
    .service("reportCreator", [


        function() {
            this.title = "";

            this.generateReportMail = function (title, workitems) {
                var doc = new jsPDF('p', 'pt', 'letter');
                doc.fromHTML(getHTML(title, workitems), 80, 80);
                this.title = title;
                window.alert(this.title);
                sendAsAttachement(title,doc.output());
            };

            var getHTML = function (title, workitems) {
                var html = getTitle(title);
                html += getReportHeader();
                html += getReportBody();
                html += getReportFooter();
                return html;
            };

            var getTitle = function (title) {
                return '<h1>' + title + '</h1>';
            };

            var getReportHeader = function () {
                return '<hr>';
            };

            var getReportBody = function () {
                var html = '';
                html += '<table>';
                html += getTableHeader();
                html += getTableContent();
                html += '</table>';
            };

            var getReportFooter = function () {
                return '<hr>';
            };

            var getTableHeader = function () {
                return '<tr style="background:grey"><td>Name</td><td>Value</td></tr>';
            };

            var getTableContent = function () {
                var html = '';
                html += '<tbody>';
                for ( i = 0; i < 10; i++) {
                    html += getRow();
                }
                return html;
            };

            var getRow = function () {
                return '<tr><td>111</td><td>222</td></tr>';
            };

            var sendAsAttachement = function (title,pdfDoc) {
                window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {

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

            var sendMailWithAttachement = function (title,attachementPath) {
                window.alert(title + "    " + attachementPath);
                window.plugin.email.open({
                    subject: title,
                    body:    'Attached you can find:  <br>' + this.title,
                    attachments: [attachementPath]
                });
            };
            return this;
        }
    ]);