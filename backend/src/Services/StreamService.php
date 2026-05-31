<?php
declare(strict_types=1);

namespace App\Services;

class StreamService
{
    public function stream(string $filePath, string $mimeType = 'audio/mpeg'): void
    {
        if (!file_exists($filePath)) {
            http_response_code(404);
            exit;
        }

        $fileSize = filesize($filePath);
        $start    = 0;
        $end      = $fileSize - 1;
        $length   = $fileSize;

        header('Accept-Ranges: bytes');
        header('Content-Type: ' . $mimeType);
        
        // Remove CORS se necessário ou adiciona headers específicos para media
        header('Access-Control-Allow-Origin: *');

        if (isset($_SERVER['HTTP_RANGE'])) {
            $range = $_SERVER['HTTP_RANGE'];
            if (preg_match('/bytes=\h*(\d+)-(\d*)[\D.*]?/i', $range, $matches)) {
                $start = (int)$matches[1];
                if (!empty($matches[2])) {
                    $end = (int)$matches[2];
                }
            }

            if ($start > $end || $start > $fileSize - 1 || $end > $fileSize - 1) {
                header('HTTP/1.1 416 Requested Range Not Satisfiable');
                header("Content-Range: bytes */$fileSize");
                exit;
            }

            $length = $end - $start + 1;
            header('HTTP/1.1 206 Partial Content');
            header("Content-Range: bytes $start-$end/$fileSize");
        } else {
            header('HTTP/1.1 200 OK');
        }

        header('Content-Length: ' . $length);
        header('Cache-Control: no-cache, must-revalidate');

        $fp = fopen($filePath, 'rb');
        fseek($fp, $start);

        $bufferSize = 8192;
        $remaining  = $length;

        while (!feof($fp) && $remaining > 0 && !connection_aborted()) {
            $bytesToRead = min($bufferSize, $remaining);
            echo fread($fp, $bytesToRead);
            $remaining -= $bytesToRead;
            flush();
        }

        fclose($fp);
        exit;
    }
}
