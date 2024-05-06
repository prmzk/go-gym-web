async function fetchData(request: URL | string, option?: RequestInit) {
  const rawResponse = await fetch(
    `${import.meta.env.VITE_API_URL}${request}`,
    option
  );
  const response = await rawResponse.json();

  if (response.status === "error") {
    throw new Error(response.message);
  }

  if (response.status === "success") {
    const { data } = response;
    return data;
  }
}

export default fetchData;
