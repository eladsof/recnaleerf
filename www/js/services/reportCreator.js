/**
 * Created by eladsof on 10/5/14.
 */
angular.module('reportCreator',[])
    .service("reportCreator", [
        function() {
            this.generateReportFile = function (title, workitems) {
                var doc = new jsPDF('p', 'pt', 'letter');
                doc.fromHTML(getHTML(title, workitems), 80, 80);
                doc.save();
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

            return this;
        }
    ]);