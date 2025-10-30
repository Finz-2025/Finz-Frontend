// UTC ISO(예: "2025-10-30T18:23:16.640Z") → KST(UTC+9)로 변환
export function splitUtcIsoToLocal(utcIso: string) {
  // ISO가 UTC인지 보장(끝에 'Z' 없으면 UTC로 간주해 강제)
  const iso = /Z$/.test(utcIso) ? utcIso : `${utcIso}Z`;

  const d = new Date(iso); // UTC 시각
  // KST(UTC+9)로 보정한 '가상 UTC 시각'
  const kst = new Date(d.getTime() + 9 * 60 * 60 * 1000);

  const yyyy = kst.getUTCFullYear();
  const mm = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(kst.getUTCDate()).padStart(2, '0');
  const HH = String(kst.getUTCHours()).padStart(2, '0');
  const MM = String(kst.getUTCMinutes()).padStart(2, '0');

  return { date: `${yyyy}-${mm}-${dd}`, time: `${HH}:${MM}` };
}

// "지금"을 KST로 반환 (디바이스 타임존 무관)
export function nowLocalDateTime() {
  // 현재 에포크 → UTC 기준으로 맞춘 다음 +9h
  const now = new Date();
  const utcMs = now.getTime() + now.getTimezoneOffset() * 60 * 1000;
  const kst = new Date(utcMs + 9 * 60 * 60 * 1000);

  const yyyy = kst.getUTCFullYear();
  const mm = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(kst.getUTCDate()).padStart(2, '0');
  const HH = String(kst.getUTCHours()).padStart(2, '0');
  const MM = String(kst.getUTCMinutes()).padStart(2, '0');

  return { date: `${yyyy}-${mm}-${dd}`, time: `${HH}:${MM}` };
}
