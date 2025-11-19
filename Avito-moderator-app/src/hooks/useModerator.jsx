// ========================================================================================
// Кастомный хук для получения данных модератора: для проверки его прав
// Таким образом при открытии главной страницы вызывается этот хук, осуществляется
// проверка прав пользователя и в зависимости от прав изображается картинка, например
// пользователю с отсутствующим правом "view_stats" не смогут видеть вкладку со статистикой
// ========================================================================================

import { useState, useEffect } from 'react';

export const useModerator = () => {
  const [moderator, setModerator] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchModerator = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/v1/moderators/me');
        if (response.ok) {
          const data = await response.json();
          setModerator(data);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchModerator();
  }, []);


  return {moderator, loading};
};
