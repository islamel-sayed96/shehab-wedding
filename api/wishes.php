<?php
// GET  → public wishes (name + message), newest first.
// POST → save an RSVP. Attendance stays private (see admin.php); the message is shown on the site.
declare(strict_types=1);
require __DIR__ . '/lib.php';

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($method === 'GET') {
    $items = [];
    foreach (array_reverse(read_store()['entries']) as $e) {
        if (!empty($e['hidden']) || ($e['message'] ?? '') === '') continue;
        $items[] = public_entry($e);
        if (count($items) >= 300) break;
    }
    json_out(['ok' => true, 'items' => $items]);
}

if ($method !== 'POST') json_out(['ok' => false, 'error' => 'method'], 405);

$in = json_decode(file_get_contents('php://input') ?: '', true);
if (!is_array($in)) $in = $_POST;

// Bots fill the hidden "website" field; pretend success and store nothing.
if (!empty($in['website'])) json_out(['ok' => true, 'item' => null]);

$name = clean((string) ($in['name'] ?? ''), 60);
$message = clean((string) ($in['message'] ?? ''), 600);
$attend = ($in['attend'] ?? '') === 'no' ? 'no' : 'yes';
$guests = $attend === 'no' ? 0 : max(1, min(10, (int) ($in['guests'] ?? 1)));

if (mb_strlen($name) < 2) json_out(['ok' => false, 'error' => 'name'], 422);

$who = hash('sha256', ($_SERVER['REMOTE_ADDR'] ?? '') . '|' . (cfg()['salt'] ?? 'wedding'));
$now = time();

try {
    $out = with_store(function (array &$db) use ($who, $now, $name, $message, $attend, $guests) {
        // At most 5 submissions per visitor every 10 minutes.
        foreach ($db['hits'] as $k => $times) {
            $db['hits'][$k] = array_values(array_filter($times, fn($t) => $t > $now - 600));
            if (!$db['hits'][$k]) unset($db['hits'][$k]);
        }
        if (count($db['hits'][$who] ?? []) >= 5) return ['limited' => true];
        $db['hits'][$who][] = $now;

        // Same person sending the same thing twice (double tap, retry) updates instead of duplicating.
        foreach ($db['entries'] as $i => $e) {
            if (($e['who'] ?? '') === $who && $e['name'] === $name && $now - $e['time'] < 3600) {
                $db['entries'][$i] = ['attend' => $attend, 'guests' => $guests, 'message' => $message ?: $e['message']] + $e;
                return ['entry' => $db['entries'][$i]];
            }
        }
        $entry = [
            'id' => bin2hex(random_bytes(6)), 'time' => $now, 'name' => $name, 'message' => $message,
            'attend' => $attend, 'guests' => $guests, 'who' => $who, 'hidden' => false,
        ];
        $db['entries'][] = $entry;
        return ['entry' => $entry];
    });
} catch (Throwable $t) {
    json_out(['ok' => false, 'error' => 'storage'], 500);
}

if (!empty($out['limited'])) json_out(['ok' => false, 'error' => 'rate'], 429);
$e = $out['entry'];
json_out(['ok' => true, 'item' => ($e['message'] !== '' && empty($e['hidden'])) ? public_entry($e) : null]);
