<?php
header('Content-Type: text/html; charset=utf-8');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Pragma: no-cache');
header('Expires: 0');
$dashboard = __DIR__ . '/dashboard.html';
if (is_file($dashboard)) {
    readfile($dashboard);
    exit;
}
http_response_code(500);
echo 'Dashboard no disponible';
