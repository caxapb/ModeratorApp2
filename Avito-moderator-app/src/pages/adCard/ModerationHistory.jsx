// ========================================================================================
// Компонент истории модерации
// Содержит простой непронумерованный лист с действиями других (и текущего тоже) модераторов
// ========================================================================================


export default  function ModerationHistory({ history }) {
  return (
    <div className="moderation-history">
      <br />
      <h3>История модерации</h3>
      <ul>
        {(history || []).map((story, i) => (
          <li key={i}>
            Модератор: {story.moderatorName}, {story.timestamp.slice(0, 10) + " " + story.timestamp.slice(11,19)}, {
              story.action === "approved" ? "Одобрено" : story.action === "rejected" ? "Отклонено" : "Отправлено на доработку"
            } <br /> Комментарий: {story.comment || ''}
            </li>
        ))}
      </ul>
    </div>
  );
}

