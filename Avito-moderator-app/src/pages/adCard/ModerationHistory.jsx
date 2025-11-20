// ========================================================================================
// Компонент истории модерации
// Содержит простой непронумерованный лист с действиями других (и текущего тоже) модераторов
// ========================================================================================


export default  function ModerationHistory({ history }) {
  const textHistory = history.map((story, i) => {
    const name = story.moderatorName;
    const time = story.timestamp.slice(0, 10) + " " + story.timestamp.slice(11,19);
    const action = story.action === "approved" ? "Одобрено" : story.action === "rejected" ? "Отклонено" : "Отправлено на доработку";
    const reason = story.reason;
    const comment = story.comment;

    if (story.action === "approved") {
      return `Модератор: ${name}, дата и время: ${time} \n✅${action}`
    } else if (story.action === "rejected") {
      return `Модератор: ${name}, дата и время: ${time} \n❌${action} \nПричина: ${reason ? reason : '-'} \nКомментарий: ${comment ? comment : '-'}`;
    } else {
      return `Модератор: ${name}, дата и время: ${time} \n🟡${action} \nПричина: ${reason ? reason : '-'} \nКомментарий: ${comment ? comment : '-'}`;
    }
  })

  return (
    <div className="moderation-history">
      <br />
      <h3>История модерации</h3>
      <ul>
        {(textHistory || []).map((story, i) => (
          <li key={i}>
            {story}
          </li>
        ))}
      </ul>
    </div>
  );
}

