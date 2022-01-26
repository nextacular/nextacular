const api = async (url, opts) => {
  if (opts) {
    const { body, ...options } = opts;
    const requestBody = JSON.stringify(body);
    const response = await fetch(url, {
      body: requestBody,
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    });
    const result = await response.json();
    return { status: response.status, ...result, url };
  } else {
    const response = await fetch(url);
    return response.json();
  }
};

export default api;
