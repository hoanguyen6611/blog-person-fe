export const fetcherWithTokenUseSWR = (url: string, token: string) =>
  fetch(url, {
    credentials: "include",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => {
    if (!res.ok) throw new Error("Failed to fetch");
    return res.json();
  });
export const fetcherUseSWR = (url: string) =>
  fetch(url, { credentials: "include" }).then((res) => res.json());
