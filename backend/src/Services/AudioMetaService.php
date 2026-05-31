<?php
declare(strict_types=1);

namespace App\Services;

class AudioMetaService
{
    public function extractMetadata(string $filePath): array
    {
        $getID3 = new \getID3();
        $info   = $getID3->analyze($filePath);
        \getid3_lib::CopyTagsToComments($info);

        $tags = $info['comments'] ?? [];

        return [
            'title'       => $tags['title'][0]  ?? null,
            'artist'      => $tags['artist'][0] ?? null,
            'album'       => $tags['album'][0]  ?? null,
            'year'        => $tags['year'][0]   ?? null,
            'genre'       => $tags['genre'][0]  ?? null,
            'track'       => $tags['track_number'][0] ?? null,
            'duration'    => (int) ($info['playtime_seconds'] ?? 0),
            'bitrate'     => (int) (($info['bitrate'] ?? 0) / 1000),
            'sample_rate' => $info['audio']['sample_rate'] ?? null,
        ];
    }
}
