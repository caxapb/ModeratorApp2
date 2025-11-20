// ========================================================================================
// Кастомный хук для получения данных модератора: для проверки его прав
// Таким образом при открытии главной страницы вызывается этот хук, осуществляется
// проверка прав пользователя и в зависимости от прав изображается картинка, например
// пользователю с отсутствующим правом "view_stats" не смогут видеть вкладку со статистикой
// ========================================================================================

import { useState, useEffect } from 'react';
import fetchData from '../utils/fetchData';

export const useModerator = () => {
  const [moderator, setModerator] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchModerator = async () => {
      try {
        const data = await fetchData('http://localhost:3001/api/v1/moderators/me');
        setModerator(data);
      } catch (err) {
        if (err instanceof TypeError) {
          console.error("Сетевая ошибка. TypeError:", err.message)
        } else {
          console.error("HTTP ошибка.", err.message)
        }
      } finally {
        setLoading(false);
      }
    }
    fetchModerator();
  }, []);

  // return [ null, false ];

  return [ moderator, loading ];
};
