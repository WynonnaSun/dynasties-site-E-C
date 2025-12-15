export const API_BASE =
  (import.meta as any).env?.VITE_API_BASE ?? "http://localhost:8000";

export async function submitEmail(email: string, name: string, message: string) {
  const res = await fetch(`${API_BASE}/api/emails`, {  
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, name, message }),  
  });
  
  if (!res.ok) {
    const msg = await res.text().catch(() => "");
    throw new Error(msg || "提交失败，请稍后再试。");
  }
  
  return res.json();
}

export async function fetchAdminEmails(username: string, password: string) {
  const auth = btoa(`${username}:${password}`);  
  const res = await fetch(`${API_BASE}/api/admin/emails`, {  
    headers: {
      "Authorization": `Basic ${auth}`
    }
  });
  
  if (!res.ok) {
    throw new Error("Unauthorized");
  }
  
  const data = await res.json();
  console.log("api.ts data:", data);
  return data;
}