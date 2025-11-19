// ========================================================================================
// Компонент, содержащий подробную информацию о товаре
// Формирует таблицу о товаре и продавце из переданного в компонент объекта объявления
// ========================================================================================


export default function AdDetails({ad}) {

  const description = ad.description.slice(ad.description.indexOf('.')+1, );
  const createDate = ad.createdAt.slice(0, 10) + " " + ad.createdAt.slice(11, 19);
  const updateDate = ad.updatedAt.slice(0, 10) + " " + ad.updatedAt.slice(11, 19);
  const status = ad.status === "approved" ? "Одобрено" : ad.status === "rejected" ? "Отклонено" : "Отправлено на доработку";
  const priority = ad.price === "urgent" ? "Срочное" : "Не срочное";
  const sellerDate = ad.seller.registeredAt.slice(0, 10) + " " + ad.seller.registeredAt.slice(11, 19);

  return (
    <div className="ad-description-container">
      <h3>Полное описание:</h3>
      <table className="description-table">
        <tbody><tr>
            <th>Цена</th>
            <td>{ad.price} ₽</td>
            <th>Имя Продавца</th>
            <td>{ad.seller.name}</td>
          </tr><tr>
            <th>Описание</th>
            <td>{description}</td>
            <th>Рейтинг Продавца</th>
            <td>{ad.seller.rating}</td>
          </tr><tr>
            <th>Категория</th>
            <td>{ad.category}</td>
            <th>Объявлений у продавца</th>
            <td>{ad.seller.totalAds}</td>
          </tr><tr>
            <th>Статус</th>
            <td>{status}</td>
            <th>Продавец зарегистрирован</th>
            <td>{sellerDate}</td>
          </tr><tr>
            <th>Приоритет</th>
            <td>{priority}</td>
          </tr><tr>
            <th>Создано</th>
            <td>{createDate}</td>
          </tr><tr>
            <th>Обновлено</th>
            <td>{updateDate}</td>
          </tr><tr>
            <th>Состояние</th>
            <td>{ad.characteristics["Состояние"]}</td>
          </tr><tr>
            <th>Гарантия</th>
            <td>{ad.characteristics["Гарантия"]}</td>
          </tr><tr>
            <th>Производитель</th>
            <td>{ad.characteristics["Производитель"]}</td>
          </tr><tr>
            <th>Модель</th>
            <td>{ad.characteristics["Модель"]}</td>
          </tr><tr>
            <th>Цвет</th>
            <td>{ad.characteristics["Цвет"]}</td>
          </tr></tbody>
      </table>

    </div>
  );
}
