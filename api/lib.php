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

function settings(): array
{
    static $s = null;
    if ($s === null) {
        $f = __DIR__ . '/settings.php';
        $s = is_file($f) ? (array) (require $f) : [];
    }
    return $s;
}

/** Send the JSON reply, close the connection, then keep running $after (so emails never slow the guest down). */
function respond_then(array $data, callable $after): void
{
    $body = json_encode($data, JSON_UNESCAPED_UNICODE);
    http_response_code(200);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    header('Content-Length: ' . strlen($body));
    header('Connection: close');
    echo $body;
    ignore_user_abort(true);
    if (function_exists('litespeed_finish_request')) litespeed_finish_request();
    elseif (function_exists('fastcgi_finish_request')) fastcgi_finish_request();
    else { while (ob_get_level() > 0) ob_end_flush(); flush(); }
    @set_time_limit(30);
    try { $after(); } catch (Throwable $t) { error_log('wishes notify: ' . $t->getMessage()); }
    exit;
}

function totals(array $entries): array
{
    $t = ['heads' => 0, 'coming' => 0, 'declined' => 0, 'replies' => count($entries)];
    foreach ($entries as $e) {
        if (($e['attend'] ?? '') === 'yes') { $t['coming']++; $t['heads'] += (int) $e['guests']; }
        else $t['declined']++;
    }
    return $t;
}

/** Email one RSVP plus the running totals. FormSubmit first (good inbox delivery), PHP mail() as a fallback. */
function notify_rsvp(array $e, array $t, bool $updated): void
{
    $to = trim((string) (cfg()['notify_email'] ?? settings()['notify_email'] ?? ''));
    if ($to === '' || !filter_var($to, FILTER_VALIDATE_EMAIL)) return;
    $yes = $e['attend'] === 'yes';
    $subject = ($updated ? 'تعديل رد — ' : '')
        . ($yes ? "حضور: {$e['name']} ({$e['guests']})" : "اعتذار: {$e['name']}")
        . " | إجمالي الحضور {$t['heads']}";
    $fields = [
        'الاسم' => $e['name'],
        'الحضور' => $yes ? 'سأحضر بإذن الله' : 'أعتذر عن الحضور',
        'عدد الحضور' => (string) $e['guests'],
        'رسالة التهنئة' => $e['message'] !== '' ? $e['message'] : '—',
        'إجمالي الحضور حتى الآن' => (string) $t['heads'],
        'عدد اللي أكدوا الحضور' => (string) $t['coming'],
        'عدد الاعتذارات' => (string) $t['declined'],
        'الوقت' => date('Y-m-d H:i', $e['time'] + 3 * 3600) . ' (القاهرة)',
    ];
    if (send_formsubmit($to, $subject, $fields)) return;
    send_php_mail($to, $subject, $fields);
}

function send_formsubmit(string $to, string $subject, array $fields): bool
{
    if (!function_exists('curl_init')) return false;
    $site = (string) (settings()['site_url'] ?? '');
    $ch = curl_init(rtrim((string) (settings()['formsubmit_url'] ?? 'https://formsubmit.co/ajax/'), '/') . '/' . $to);
    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 12,
        CURLOPT_CONNECTTIMEOUT => 6,
        CURLOPT_HTTPHEADER => ['Content-Type: application/json', 'Accept: application/json', 'Origin: ' . rtrim($site, '/'), 'Referer: ' . $site],
        CURLOPT_POSTFIELDS => json_encode(['_subject' => $subject, '_template' => 'table', '_captcha' => 'false'] + $fields, JSON_UNESCAPED_UNICODE),
    ]);
    $res = curl_exec($ch);
    $code = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    $data = is_string($res) ? json_decode($res, true) : null;
    return $code === 200 && is_array($data) && in_array($data['success'] ?? null, [true, 'true'], true);
}

function send_php_mail(string $to, string $subject, array $fields): bool
{
    $host = parse_url((string) (settings()['site_url'] ?? ''), PHP_URL_HOST) ?: 'localhost';
    $rows = '';
    foreach ($fields as $k => $v) {
        $rows .= '<tr><th style="text-align:right;padding:6px 10px;background:#f3eadb">' . htmlspecialchars($k) . '</th><td style="padding:6px 10px">' . nl2br(htmlspecialchars($v)) . '</td></tr>';
    }
    $html = '<div dir="rtl" style="font-family:Tahoma,Arial,sans-serif"><table style="border-collapse:collapse;border:1px solid #e3cfa6">' . $rows . '</table></div>';
    $headers = implode("\r\n", [
        'MIME-Version: 1.0',
        'Content-Type: text/html; charset=UTF-8',
        'From: =?UTF-8?B?' . base64_encode('دعوة شهاب ورحمة') . "?= <no-reply@{$host}>",
    ]);
    return @mail($to, '=?UTF-8?B?' . base64_encode($subject) . '?=', $html, $headers);
}
