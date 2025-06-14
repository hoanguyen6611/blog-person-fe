export const fetcherWithTokenUseSWR = (url: string, token: string) =>
  fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => {
    if (!res.ok) throw new Error("Failed to fetch");
    return res.json();
  });
export const fetcherUseSWR = (url: string) =>
  fetch(url).then((res) => res.json());
