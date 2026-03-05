export function logout() {
  // Clear cookies
  document.cookie = "token=; path=/; max-age=0";
  document.cookie = "role=; path=/; max-age=0";

  // Clear localStorage
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("full");
  localStorage.removeItem("ticket");

  // Redirect to login
  window.location.href = "/Login";
}

export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  return !!localStorage.getItem("token");
}

export function getUserRole(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("role");
}


export function getFullName(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("full");
}