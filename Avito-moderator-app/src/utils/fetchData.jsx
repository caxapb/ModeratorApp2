export default async function fetchData(url, params = null) {
  const response = await fetch(url, params);
  let message;

  if (!response.ok) {
    try {
      const error = await response.json();
      message = `Ошибка ${response.status}: ${error.error} \n ${error.message || 'Запрос для id ' + error.id || ''}`;
    } catch {
      message = `Ошибка обработки ответа от сервера. ${response.status}: ${response.statusText}`;
    }
    throw new Error(`${message}`);
  }
  return await response.json();
}