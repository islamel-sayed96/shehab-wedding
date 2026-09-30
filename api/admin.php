<?php
// Private page for the couple: who is coming, head count, all messages, hide/show/delete.
// Open it as  api/admin.php?key=YOUR_ADMIN_KEY  (the key lives in api/config.php).
declare(strict_types=1);
require __DIR__ . '/lib.php';

header('X-Robots-Tag: noindex');
header('Cache-Control: no-store');
$key = admin_key();
$given = (string) ($_POST['key'] ?? $_GET['key'] ?? '');
$h = fn($s) => htmlspecialchars((string) $s, ENT_QUOTES, 'UTF-8');

if ($key === null) {
    http_response_code(503);
    exit('<meta charset="utf-8"><p dir="rtl" style="font:18px sans-serif;padding:24px">صفحة المتابعة مقفولة: اعمل ملف <b>api/config.php</b> من <b>config.sample.php</b> وحط فيه كلمة سر طويلة.</p>');
}
if (!hash_equals($key, $given)) {
    http_response_code(403);
    exit('<meta charset="utf-8"><p dir="rtl" style="font:18px sans-serif;padding:24px">كلمة السر غلط.</p>');
}

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'POST') {
    $id = (string) ($_POST['id'] ?? '');
    $act = (string) ($_POST['act'] ?? '');
    with_store(function (array &$db) use ($id, $act) {
        foreach ($db['entries'] as $i => $e) {
            if ($e['id'] !== $id) continue;
            if ($act === 'delete') array_splice($db['entries'], $i, 1);
            else $db['entries'][$i]['hidden'] = $act === 'hide';
            return true;
        }
        return false;
    });
    header('Location: admin.php?key=' . rawurlencode($given), true, 303);
    exit;
}

$entries = array_reverse(read_store()['entries']);

if (($_GET['format'] ?? '') === 'csv') {
    header('Content-Type: text/csv; charset=utf-8');
    header('Content-Disposition: attachment; filename="rsvp.csv"');
    $out = fopen('php://output', 'w');
    fwrite($out, "\xEF\xBB\xBF");
    fputcsv($out, ['الوقت', 'الاسم', 'الحضور', 'العدد', 'الرسالة', 'مخفية']);
    foreach ($entries as $e) {
        fputcsv($out, [date('Y-m-d H:i', $e['time'] + 3 * 3600), $e['name'], $e['attend'] === 'yes' ? 'حاضر' : 'معتذر', $e['guests'], $e['message'], !empty($e['hidden']) ? 'نعم' : '']);
    }
    exit;
}

$coming = array_filter($entries, fn($e) => $e['attend'] === 'yes');
$heads = array_sum(array_map(fn($e) => (int) $e['guests'], $coming));
$declined = count($entries) - count($coming);
?><!DOCTYPE html>
<html lang="ar" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>متابعة الحضور</title>
<style>
  body { margin: 0; padding: 20px 16px 60px; background: #f6efe3; color: #5a4731; font: 16px/1.7 system-ui, "Segoe UI", Tahoma, sans-serif; }
  h1 { font-size: 24px; margin: 0 0 14px; color: #8a5524; }
  .stats { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 16px; }
  .stat { background: #fcf9f2; border: 1px solid #e3cfa6; border-radius: 10px; padding: 10px 16px; min-width: 120px; }
  .stat b { display: block; font-size: 28px; color: #b7773a; font-variant-numeric: tabular-nums; }
  .wrap { overflow-x: auto; background: #fcf9f2; border: 1px solid #e3cfa6; border-radius: 10px; }
  table { border-collapse: collapse; width: 100%; min-width: 640px; }
  th, td { text-align: start; padding: 10px 12px; border-bottom: 1px solid #efe3cc; vertical-align: top; }
  th { background: #f3eadb; font-weight: 600; white-space: nowrap; }
  tr.hidden td { opacity: .45; }
  .no { color: #a3402f; }
  td.msg { max-width: 420px; white-space: pre-wrap; }
  form { display: inline; }
  button { font: inherit; font-size: 14px; border: 1px solid #b7773a; background: #fff; color: #8a5524; border-radius: 6px; padding: 2px 10px; cursor: pointer; margin: 2px; }
  a.csv { display: inline-block; margin-bottom: 14px; color: #8a5524; }
</style></head><body>
<h1>متابعة الحضور</h1>
<div class="stats">
  <div class="stat"><b><?= $heads ?></b>إجمالي الحضور</div>
  <div class="stat"><b><?= count($coming) ?></b>رد بالحضور</div>
  <div class="stat"><b><?= $declined ?></b>اعتذار</div>
  <div class="stat"><b><?= count($entries) ?></b>إجمالي الردود</div>
</div>
<a class="csv" href="admin.php?key=<?= $h(rawurlencode($given)) ?>&amp;format=csv">تحميل الردود Excel (CSV)</a>
<div class="wrap"><table>
<tr><th>الوقت</th><th>الاسم</th><th>الحضور</th><th>العدد</th><th>الرسالة</th><th></th></tr>
<?php foreach ($entries as $e): ?>
<tr class="<?= !empty($e['hidden']) ? 'hidden' : '' ?>">
  <td><?= $h(date('d/m H:i', $e['time'] + 3 * 3600)) ?></td>
  <td><?= $h($e['name']) ?></td>
  <td class="<?= $e['attend'] === 'yes' ? '' : 'no' ?>"><?= $e['attend'] === 'yes' ? 'حاضر' : 'معتذر' ?></td>
  <td><?= (int) $e['guests'] ?></td>
  <td class="msg"><?= $h($e['message']) ?></td>
  <td>
    <form method="post"><input type="hidden" name="key" value="<?= $h($given) ?>"><input type="hidden" name="id" value="<?= $h($e['id']) ?>">
      <?php if (!empty($e['hidden'])): ?><button name="act" value="show">إظهار</button><?php else: ?><button name="act" value="hide">إخفاء</button><?php endif; ?>
      <button name="act" value="delete" onclick="return confirm('حذف الرد نهائياً؟')">حذف</button>
    </form>
  </td>
</tr>
<?php endforeach; ?>
<?php if (!$entries): ?><tr><td colspan="6">لسه مفيش ردود.</td></tr><?php endif; ?>
</table></div>
</body></html>
