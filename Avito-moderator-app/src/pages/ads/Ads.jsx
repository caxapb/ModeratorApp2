// ========================================================================================
// Компонент, формирующий главную страницу.
// На странице изображен сайдбар по левую сторону, хедер и список объявлений, разбитый пагинацией
// Из полей, измененных модератором, берутся значения и формируется строка запроса к серверу
// Возвращается подходящий список объявлений и информация о пагинации
// ========================================================================================


// Из схемы enum: [createdAt, price, priority] (tech-int3-server/schema.yaml)
// const sortVariants = ['createdAt', 'price', 'priority'];
// const sortOrders = ['asc', 'desc']

import { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import AdPreview from '../../components/AdPreview';
import fetchData from '../../utils/fetchData';
import { useSearchParams } from 'react-router-dom';

import './Ads.css'

export default function Ads() {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);

  const [curPage, setCurPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [pagination, setPagination] = useState(null);

  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [minSelectedPrice, setMinSelectedPrice] = useState('');
  const [maxSelectedPrice, setMaxSelectedPrice] = useState('');

  const [searchParams] = useSearchParams();
  const search = searchParams.get('search') || '';

  const [sortOrder, setSortOrder] = useState('');
  const [sortBy, setSortBy] = useState('');

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // формирование строки запроса с фильтрами и сортировкой
  // получение ответа: сложный объект со списком объявлений и информацией о пагинации
  // сохранение индексов подходящих объявлений в localStorage для того, чтобы они были доступны на карточке товара
  // (для навигации от объявления к объявлению без перехода к списку)
  useEffect(() => {
    const params = new URLSearchParams();

    params.set('page', String(curPage));
    params.set('limit', String(limit));

    selectedStatuses.forEach((status) => {
      params.append('status', status);
    });

    // строгая проверка на пустую строку, так как ID может быть 0
    selectedCategory !== '' ? params.append('categoryId', selectedCategory) : '';

    minSelectedPrice !== '' ? params.append('minPrice', minSelectedPrice) : '';
    maxSelectedPrice !== '' ? params.append('maxPrice', maxSelectedPrice) : '';

    if (search) {
      params.set('search', search);
    }
    if (sortBy) {
      params.set('sortBy', sortBy);
    }
    if (sortOrder) {
      params.set('sortOrder', sortOrder);
    }

    const fetchAds = async () => {
      try {
        const data = await fetchData(`http://localhost:3001/api/v1/ads?${params.toString()}`);
        setAds(data.ads);
        setPagination(data.pagination);
        localStorage.setItem('ids', JSON.stringify(data.ads.map(ad => ad.id)))
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
    fetchAds();

  }, [selectedStatuses, selectedCategory, 
    minSelectedPrice, maxSelectedPrice, 
    search, sortBy, sortOrder, curPage, limit]);

  if (loading) return <div>Загрузка...</div>;

  const currentPage = pagination.currentPage;
  const totalPages = pagination.totalPages;
  const totalItems = pagination.totalItems;

  // функция для перехода к новой странице
  // проверка на валидность номера страницы
  const goTo = (p) => {
    if (p < 1 || p > totalPages) return;
    setCurPage(p);
  };

  // обработка настройки количества объявлений на странице
  // проверка чисел
  // значение берется из инпута (при изменении)
  const changeLimit = (e) => {
    const raw = e.target.value;
    if (raw === '') {
      setLimit(10);
      return;
    }
    let value = +raw;
    if (Number.isNaN(value)) return;
    if (value < 1) value = 1;
    if (value > 100) value = 100;

    setLimit(value);
    setCurPage(1);
  };
  // Порядок:
  // формирование компонента сайдбара
  // формирование полей для сортировки, обработчиков событий при их изменении и количества объявлений на страницу
  // лист объявлений
  // пагинация со страницами, общее количество объявлений
  return (
    <>
    <div className='main-page'>
      <button className="sidebar-toggle-btn" onClick={toggleSidebar}>
        ☰
      </button>
      <Sidebar 
        selectedStatuses={selectedStatuses}
        setSelectedStatuses={setSelectedStatuses}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        minSelectedPrice={minSelectedPrice}
        setMinSelectedPrice={setMinSelectedPrice}
        maxSelectedPrice={maxSelectedPrice}
        setMaxSelectedPrice={setMaxSelectedPrice}
        isSidebarOpen={isSidebarOpen}
      />

      <div>
        <div className="sorting-container">
          <div className='sorting-block'> 
          <div> <label>Сортировка:&nbsp;</label> </div>
          <div> 
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="">Нет</option>
            <option value="createdAt">По дате</option>
            <option value="price">По цене</option>
            <option value="priority">По приоритету</option>
            </select>
          </div>

          <div>
            <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
            <option value="">Порядок</option>
            <option value="asc">Возрастание</option>
            <option value="desc">Убывание</option>
            </select>
          </div>     
          </div>

          <div className='pagination-size'>
            <label>Единиц на странице:  </label>
            <input type="number" value={limit}
              onChange={changeLimit}/>
          </div>     

        </div>

        <div className="ad-list">
          {ads.map(ad => (
            <AdPreview key={ad.id} ad={ad} />
          ))}
        </div>
        <div className='pagination'>
      <div className="pagination-info">
        Всего {totalItems} объявлений
      </div>
      <div>
        <button onClick={() => goTo(currentPage - 1)}> ◀ </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button key={page} onClick={() => goTo(page)}
                className={page === currentPage ? 'active' : ''}>
                {page}
              </button>
            ))}

        <button onClick={() => goTo(currentPage + 1)} disabled={currentPage >= totalPages}> ▶ </button>
      </div>
    </div>
      </div>
    </div>

    </>
  );
}
