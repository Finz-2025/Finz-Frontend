/**
 * 서버가 UTC ISO("...Z")로 내려줄 때, 사용자의 로컬(KST 등) 기준으로
 * YYYY-MM-DD / HH:mm 문자열로 분리해서 반환
 */
export function splitUtcIsoToLocal(utcIso: string) {
  const d = new Date(utcIso);

  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');

  const HH = String(d.getHours()).padStart(2, '0');
  const MM = String(d.getMinutes()).padStart(2, '0');

  return { date: `${yyyy}-${mm}-${dd}`, time: `${HH}:${MM}` };
}
