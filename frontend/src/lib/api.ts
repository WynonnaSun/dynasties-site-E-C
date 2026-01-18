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

export type ImageItem = {
  id: number;
  image_url: string;
  alt_text?: string | null;
  link_url?: string | null;
  is_hidden?: boolean;
  sort_order?: number;
};

export type ImageSectionResponse = {
  section?: {
    id?: number;
    key?: string;
    locale?: string;
    is_enabled?: boolean;
  };
  images: ImageItem[];
};

export async function fetchImageSection(
  locale: string,
  sectionKey: string,
  includeHidden = false
): Promise<ImageSectionResponse> {
  const params = new URLSearchParams();
  if (includeHidden) params.set("include_hidden", "true");

  const url =
    `${API_BASE}/api/content/${encodeURIComponent(locale)}/${encodeURIComponent(sectionKey)}` +
    (params.toString() ? `?${params.toString()}` : "");

  const res = await fetch(url);

  if (!res.ok) {
    const msg = await res.text().catch(() => "");
    throw new Error(msg || "Failed to fetch image section");
  }

  return res.json();
}
