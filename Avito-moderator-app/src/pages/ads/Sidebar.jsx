// ========================================================================================
// Компонент боковой панели
// Панель не движется со скролингом списка объявлений, содержит в себе фильтры по категориям,
// статусам, цене
// Функции-обработчики (toggle...()) вызываются при изменении полей ввода (селекторы, инпуты) модератором,
// работают с состояниями для синхронного изменения
// ========================================================================================

import './styles/Sidebar.css'

// Из схемы Advertisement (tech-int3-server/schema.yaml)
const statuses = ['pending', 'approved', 'rejected', 'draft'];

// Из файла tech-int3-server/src/models/v1/data.js
// Иного доступа к ID категорий не было мной найдено
// Индексы в массиве соответствуют ID
const categories = ['Электроника', 'Недвижимость', 'Транспорт', 'Работа', 'Услуги', 'Животные', 'Мода', 'Детское']


export default function Sidebar({ 
  selectedStatuses, setSelectedStatuses,
  selectedCategory, setSelectedCategory,
  minSelectedPrice, setMinSelectedPrice,
  maxSelectedPrice, setMaxSelectedPrice,
  isSidebarOpen
}) {

  // обработчики статуса и категории
  const toggleStatus = (status) => {
    selectedStatuses.includes(status) ?
        setSelectedStatuses(selectedStatuses.filter(stat => stat !== status)) :
        setSelectedStatuses([...selectedStatuses, status]);
  };
  const toggleCategory = (cat) => {
    selectedCategory === '' 
    ? setSelectedCategory(categories.indexOf(cat)) 
      : selectedCategory === cat ? setSelectedCategory('') : setSelectedCategory (categories.indexOf(cat));
  }

  // сброс всех фильтров
  const drop = () => {
    setSelectedStatuses([]);
    setSelectedCategory('');
    setMinSelectedPrice('');
    setMaxSelectedPrice('');
  };

  return (
    <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>

      <h3>Статус</h3>
      {statuses.map((status) => (
        <label key={status} >
          <input
            type="checkbox"
            checked={selectedStatuses.includes(status)}
            onChange={() => toggleStatus(status)}
          />
          {status === "pending" ? "На доработке" : status === "rejected" ? "Отклонено" : 
          status === "approved" ? "Одобрено" : "Черновик"} <br />
        </label>
      ))}

      <h3>Категория</h3>
        {categories.map((cat) => (
          <label key={cat} >
            <input
              type="checkbox"
              checked={categories[selectedCategory] === cat}
              onChange={() => toggleCategory(cat)}
            />
            {cat} <br />
          </label>
        ))}

      <h3>Цена</h3>
        <input className='text-input'
          type="number"
          placeholder="от"
          value={minSelectedPrice}
          onChange={e => setMinSelectedPrice(e.target.value)}
        />
        <input className='text-input'
            type="number"
            placeholder="до"
            value={maxSelectedPrice}
            onChange={e => setMaxSelectedPrice(e.target.value)}
        />

      <button type="button" onClick={drop}> Сбросить </button>
    </div>
  );
}
