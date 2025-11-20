// ========================================================================================
// Компонент, формирующий основную панель модератора
// Хендлит нажатие на кнопки одобрить/отклонить/отправить на доработку:
// - Одобрение: простой ПОСТ запрос на сервер
// = Отклонение: всплытие окна-формы при нажатии, где необходимо заполнить поля и вновь
//    подтвердить свой выбор (или нажать Отмена), далее отправляется ПОСТ запрос
// - На доработку: аналогично отклонению, всплывает окно, где модератор обязан дать фидбек
//    автору, далее отправляется ПОСТ запрос или модератор отменяет свое действие
// Перед каждым запросом осуществляется проверка есть ли у модератора права на то или иное действие
// Осуществлены Горячие клавиши: A/a - для оодобрения, D/d - для отклонения. При нажатии клавиши 
// происходит то же, что и при клике на кнопку
// ========================================================================================


import { useState, useEffect, useCallback } from 'react';
import { useModerator } from '../../hooks/useModerator';
import fetchData from '../../utils/fetchData';

const reasonsReject = [
  "Запрещенный товар",
  "Неверная категория",
  "Некорректное описание",
  "Проблемы с фото",
  "Подозрение на мошенничество",
  "Другое",
];

export default function ModeratorPannel({ id }) {
  const [moderator, loading] = useModerator();
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [showRequestChangesForm, setShowRequestChangesForm] = useState(false);
  const [reason, setReason] = useState(reasonsReject[0]);
  const [comment, setComment] = useState('');

  const handleApprove = useCallback(async () => {
    if (!moderator?.permissions?.includes("approve_ads")) {
      alert("У вас недостаточно прав");
      return;
    }

    try {
      await fetchData(`http://localhost:3001/api/v1/ads/${id}/approve`, { method: 'POST' });
    } catch (err) {
      if (err instanceof TypeError) {
        console.error("Сетевая ошибка:", err.message);
      } else {
        console.error("Ошибка при одобрении объявления.", err.message);
      }
    }
    window.location.reload();
  }, [moderator, id]);

  useEffect(() => {
    const handleKey = (e) => {
      // проверка, откуда нажата клавиша: если из окна ввода, то игнорировать и просто печатать ее, не обрабатывать
      const tag = e.target.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;

      // обработка специальных клавиш (теперь они нажаты вне окон ввода)
      if (e.key === "a" || e.key === "A" || e.key === "ф" || e.key === "Ф") {
        e.preventDefault();
        handleApprove();
      }
      if (e.key === "d" || e.key === "D" || e.key === "в" || e.key === "В") {
        e.preventDefault();
        setShowRejectForm(true);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleApprove]);

  if (loading) {
    return <div>Загрузка...</div>;
  }
  if (!moderator) {
    return <div>Доступ запрещен</div>;
  }

  const handleReject = async(e) => {
    e.preventDefault();
    if (!moderator?.permissions?.includes("reject_ads")) {
      alert("У вас недостаточно прав");
      return;
    }

    const body = { 'reason': reason, 'comment': comment.trim() };

    try {
      await fetchData(`http://localhost:3001/api/v1/ads/${id}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      setShowRejectForm(false);
      setReason('');
      setComment('');
    } catch (err) {
      if (err instanceof TypeError) {
        console.error("Сетевая ошибка:", err.message);
      } else {
        console.error("Ошибка при отклонении объявления.", err.message);
      }
    }
    window.location.reload();
  };

  const handleRequestChanges = async(e) => {
    e.preventDefault();
    if (!moderator?.permissions?.includes("request_changes")) {
      alert("У вас недостаточно прав");
      return;
    }

    const body = { 'reason': reason, 'comment': comment.trim() };

    try {
      await fetchData(`http://localhost:3001/api/v1/ads/${id}/request-changes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      setShowRejectForm(false);
      setReason('');
      setComment('');
    } catch (err) {
      if (err instanceof TypeError) {
        console.error("Сетевая ошибка:", err.message);
      } else {
        console.error("Ошибка при отправке объявления на доработку.", err.message);
      }
    }
    window.location.reload();
  };
  

  return (
    <>
    <div className="moderators-panel">
      <button className="pannel-approve" onClick={() => { handleApprove() }}>Одобрить</button>
      <button className="pannel-reject" onClick={() => { setShowRejectForm(true) }}>Отклонить</button>
      <button className="pannel-rewrite" onClick={() => { setShowRequestChangesForm(true) }}>Доработать</button>
    </div>
    <div>
    {/* если showRejectForm - состояние, говорящее о том, что была нажата клавиша или кнопка на Отклонение - 
        не false, то показываем окно-форму для заполнения фидбека от модератора, модератор подтверждает 
        свое решение
        При повторном нажатии на кнопку Отклонить, которая находится в окне-форме, отправить ПОСТ запрос на сервер 
        и сменить состояние showRejectForm - отклик уже отправлен, можно закрывать окно-форму*/}
    {showRejectForm && (
        <form className="reject-form" onSubmit={handleReject}>
          <label>Выберите причину отклонения (обязательно):</label>
          <select required value={reason} onChange={(e) => setReason(e.target.value)} >
            {reasonsReject.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>

          <label>
            Комментарий (необязательно)
          </label>
          <textarea value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Дайте автору комментарий"
          />

          <div className="send-container">
            <button onClick={() => { setShowRejectForm(false); }}>
              Отмена
            </button>
            <button type="submit" className='pannel-reject'>
              Отклонить
            </button>
          </div>
        </form>
      )}
      
      {/* Аналогично обработке отклонения */}
      {showRequestChangesForm && (
        <form className="request-changes-form" onSubmit={handleRequestChanges}>
          <label>Выберите причину отклонения (обязательно):</label>
          <select required value={reason} onChange={(e) => setReason(e.target.value)} >
            {reasonsReject.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>

          <label> Дайте комментарий (обязательно) </label>
          <textarea value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Дайте автору комментарий"
            required
          />

          <div className="send-container">
            <button onClick={() => { setShowRequestChangesForm(false); }}>
              Отмена
            </button>
            <button type="submit" className='pannel-rewrite'>
              На доработку
            </button>
          </div>
        </form>
      )}
    </div>
    </>
  );
}
