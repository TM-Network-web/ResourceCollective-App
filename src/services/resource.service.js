
import { apiRequest } from "@/lib/api-client";

export const resourceService = {
  getAll(subject = "") {
    const query = subject
      ? `?subject=${encodeURIComponent(subject)}`
      : "";

    return apiRequest(`/api/resources${query}`);
  },

  getById(id) {
    return apiRequest(`/api/resources/${encodeURIComponent(id)}`);
  },

  upload(formData) {
    return apiRequest("/api/resources", {
      method: "POST",
      body: formData,
    });
  },

  update(id, data) {
    return apiRequest(`/api/resources/${encodeURIComponent(id)}`, {
      method: "PUT",
      body: data,
    });
  },

  delete(id) {
    return apiRequest(`/api/resources/${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
  },
};
