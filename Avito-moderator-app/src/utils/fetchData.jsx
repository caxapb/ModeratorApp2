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

async function fetchApprove({ moderator, id }) {
  if (!moderator?.permissions?.includes("approve_ads")) {
    alert("У вас недостаточно прав");
    return;
  }

  try {
    await fetchData(`http://localhost:3001/api/v1/ads/${id}/approve`, { method: 'POST' });
    return true;
  } catch (err) {
    if (err instanceof TypeError) {
      console.error("Сетевая ошибка:", err.message);
      return false;
    } else {
      console.error("Ошибка при одобрении объявления.", err.message);
      return false;
    }
  }
}

async function fetchReject({ moderator, id, body }) {
  if (!moderator?.permissions?.includes("request_changes")) {
    alert("У вас недостаточно прав");
    return;
  }

  try {
    await fetchData(`http://localhost:3001/api/v1/ads/${id}/reject`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    return true;

  } catch (err) {
    if (err instanceof TypeError) {
      console.error("Сетевая ошибка:", err.message);
      return false;
    } else {
      console.error("Ошибка при отправке объявления на доработку.", err.message);
      return false;
    }
  }
}

async function fetchRequestChanges({ moderator, id, body }) {
  if (!moderator?.permissions?.includes("request_changes")) {
    alert("У вас недостаточно прав");
    return;
  }

  try {
    await fetchData(`http://localhost:3001/api/v1/ads/${id}/request-changes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    return true;

  } catch (err) {
    if (err instanceof TypeError) {
      console.error("Сетевая ошибка:", err.message);
      return false;
    } else {
      console.error("Ошибка при отправке объявления на доработку.", err.message);
      return false;
    }
  }
}

export {fetchData, fetchApprove, fetchReject, fetchRequestChanges};
