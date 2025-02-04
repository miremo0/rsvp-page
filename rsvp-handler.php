<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Content-Type');

$rsvpFile = 'rsvp-data.txt';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get the raw POST data
    $data = json_decode(file_get_contents('php://input'), true);
    
    if ($data) {
        // Write to file
        $success = file_put_contents($rsvpFile, json_encode($data));
        
        if ($success !== false) {
            echo json_encode(['status' => 'success', 'message' => 'RSVP data saved successfully']);
        } else {
            http_response_code(500);
            echo json_encode(['status' => 'error', 'message' => 'Failed to save RSVP data']);
        }
    } else {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Invalid data format']);
    }
} else if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (file_exists($rsvpFile)) {
        $data = file_get_contents($rsvpFile);
        echo $data;
    } else {
        echo json_encode([]);
    }
}
?> 