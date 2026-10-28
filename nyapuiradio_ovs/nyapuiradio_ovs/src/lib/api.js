const API_URL = process.env.REACT_APP_API_URL || "";

export const API_ORIGIN =
  API_URL ||
  (process.env.NODE_ENV === "development" ? "http://localhost:3000" : "");

export function mediaUrl(path) {
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path;
  return `${API_ORIGIN}${path}`;
}

async function parse(response) {
  const text = await response.text();
  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = null;
    }
  }
  if (!response.ok) {
    const error = new Error(
      (data && data.error) || `Request failed (${response.status})`,
    );
    error.status = response.status;
    throw error;
  }
  return data;
}

export function getJSON(path) {
  return fetch(`${API_URL}${path}`, {
    headers: { Accept: "application/json" },
    credentials: "include",
  }).then(parse);
}

export function postJSON(path, body) {
  return fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    credentials: "include",
    body: JSON.stringify(body),
  }).then(parse);
}
