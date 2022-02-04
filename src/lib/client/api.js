const api = async (url, options) => {
  if (options) {
    const { body, ...opts } = options;
    const requestBody = JSON.stringify(body);
    const response = await fetch(url, {
      body: requestBody,
      headers: {
        'Content-Type': 'application/json',
      },
      ...opts,
    });
    const result = await response.json();
    return { status: response.status, ...result, url };
  } else {
    const response = await fetch(url);
    return response.json();
  }
};

export default api;
