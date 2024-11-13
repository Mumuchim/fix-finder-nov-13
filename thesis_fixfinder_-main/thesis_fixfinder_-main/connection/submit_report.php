<?php
// Include your database connection file
include 'connect.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Collect form data
    $title = $_POST['title'];
    $details = $_POST['details'];
    $reportType = $_POST['reportType'];
    $reportDate = $_POST['reportDate'];

    // Handle file upload
    $fileName = '';
    if (isset($_FILES['file'])) {
        $targetDir = 'uploads/';
        $targetFile = $targetDir . basename($_FILES['file']['name']);
        if (move_uploaded_file($_FILES['file']['tmp_name'], $targetFile)) {
            echo "The file " . basename($_FILES['file']['name']) . " has been uploaded.";
        } else {
            echo "Sorry, there was an error uploading your file.";
        }
    }

    // Insert report into database
    $stmt = $conn->prepare("INSERT INTO reports (title, details, report_type, file_path, report_date) 
                            VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("sssss", $title, $details, $reportType, $fileName, $reportDate);

    if ($stmt->execute()) {
        echo "Report submitted successfully.";
    } else {
        echo "Error: " . $stmt->error;
    }

    $stmt->close();
    $conn->close();
}
?>
