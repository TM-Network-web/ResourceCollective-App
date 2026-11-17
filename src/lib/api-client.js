
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

export async function apiRequest(endpoint, options = {}) {
  const {
    method = "GET",
    body,
    headers = {},
  } = options;

  const requestHeaders = {
    Accept: "application/json",
    ...headers,
  };

  let requestBody = body;

  if (body && !(body instanceof FormData)) {
    requestHeaders["Content-Type"] = "application/json";
    requestBody = JSON.stringify(body);
  }

  let response;

  try {
    response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method,
      headers: requestHeaders,
      body: requestBody,
      credentials: "include",
      cache: "no-store",
    });
  } catch {
    throw new Error(
      "Cannot connect to the server. Check your backend URL and server status."
    );
  }

  if (response.status === 204) {
    return null;
  }

  let result;

  try {
    result = await response.json();
  } catch {
    throw new Error("Server returned an invalid response.");
  }

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Your session has expired. Please log in again.");
    }

    if (response.status === 403) {
      throw new Error("You do not have permission to perform this action.");
    }

    throw new Error(
      result?.error ||
      result?.message ||
      `Request failed with status ${response.status}.`
    );
  }

  if (result?.success === false) {
    throw new Error(result.error || "Request failed.");
  }

  return result?.data ?? result;
}
