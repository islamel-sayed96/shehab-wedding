<?php
// Shared helpers for the wishes API: JSON file storage with locking, input cleaning, config.
declare(strict_types=1);

const DATA_DIR = __DIR__ . '/data';
const DATA_FILE = DATA_DIR . '/wishes.json';

function cfg(): array
{
    static $c = null;
    if ($c === null) {
        $f = __DIR__ . '/config.php';
        $c = is_file($f) ? (array) (require $f) : [];
    }
    return $c;
}

function json_out(array $data, int $code = 200): void
{
    http_response_code($code);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    header('X-Content-Type-Options: nosniff');
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

function empty_store(): array
{
    return ['entries' => [], 'hits' => []];
}

function read_store(): array
{
    if (!is_file(DATA_FILE)) return empty_store();
    $h = fopen(DATA_FILE, 'r');
    if (!$h) return empty_store();
    flock($h, LOCK_SH);
    $raw = stream_get_contents($h);
    flock($h, LOCK_UN);
    fclose($h);
    $db = json_decode($raw ?: '', true);
    return is_array($db) ? $db + empty_store() : empty_store();
}

/** Run $fn(&$db) under an exclusive lock and save the result unless $fn returns false. */
function with_store(callable $fn)
{
    if (!is_dir(DATA_DIR)) mkdir(DATA_DIR, 0755, true);
    $h = fopen(DATA_FILE, 'c+');
    if (!$h) throw new RuntimeException('storage unavailable');
    flock($h, LOCK_EX);
    $raw = stream_get_contents($h);
    $db = json_decode($raw ?: '', true);
    $db = is_array($db) ? $db + empty_store() : empty_store();
    $result = $fn($db);
    if ($result !== false) {
        ftruncate($h, 0);
        rewind($h);
        fwrite($h, json_encode($db, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
        fflush($h);
    }
    flock($h, LOCK_UN);
    fclose($h);
    return $result;
}

function clean(string $s, int $max): string
{
    $s = strip_tags($s);
    $s = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', '', $s) ?? '';
    $s = preg_replace("/\r\n?/", "\n", $s) ?? '';
    $s = trim(preg_replace("/\n{3,}/", "\n\n", $s) ?? '');
    return mb_substr($s, 0, $max);
}

function public_entry(array $e): array
{
    return ['id' => $e['id'], 'name' => $e['name'], 'message' => $e['message'], 'time' => $e['time']];
}

function admin_key(): ?string
{
    $k = (string) (cfg()['admin_key'] ?? '');
    // Refuse the placeholder and anything too short to be a real password.
    if (strlen($k) < 12 || strpos($k, 'CHANGE') !== false) return null;
    return $k;
}
