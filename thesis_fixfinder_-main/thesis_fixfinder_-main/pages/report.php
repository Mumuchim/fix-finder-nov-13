<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css">
    <title>Report Detail</title>
    <link rel="stylesheet" href="../css/style.css">
    <link rel="stylesheet" href="../css/report.css">
    
</head>
<body class="report_details">
    <div id="sidebar-container"></div>
    <button class="open-button" onclick="openForm()">new report</button>
    <div class="form-popup" id="myForm">
        <form action="../connection/submit_report.php" method="POST" enctype="multipart/form-data" class="form-container">
            <div class="report">
                <h1>Report</h1>

                
                <label><p>Report here your concern.<p></label>
                <div class="report-title">
                    <p>Title</p>
                    <input type="text" name="title" placeholder="Enter a title here">
                </div>
                <textarea rows="10" cols="40" name="details" placeholder="Write your details here.."></textarea>

                <div class="report-type">
                    <label for="reportType">Report Type:</label>
                    <select id="reportType" name="reportType">
                        <option value="">Select Report Type</option>
                        <option value="caution">Caution</option>
                        <option value="cleaning">Cleaning</option>
                        <option value="electrical-hazard">Electrical Hazard</option>
                        <option value="it-maintenance">IT Maintenance</option>
                        <option value="repair">Repair</option>
                        <option value="request">Request</option>
                    </select>
                </div>
                
                
                <div class="file-upload">
                    <label for="myfile">Attach a file:</label>
                    <input type="file" id="myfile" name="myfile">
                </div>
                <div class="date-picker-section">
                    <label for="reportDate" class="date-label">Report Date:</label>
                    <input type="date" id="reportDate" name="reportDate" class="date-picker">
                </div>
            </div>
                 
                <button type="submit" class="btn">SUBMIT</button>
                <button type="button" class="btn cancel" onclick="closeForm()">CLOSE</button>
            </div>
        </form>
    </div>
    <script src="../script/loadSidebar.js"></script>
    <script src="../script/script.js"></script>
    
</body>
</html>
