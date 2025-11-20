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
import { useModerator } from '../../hooks/useModerator';
import AdsHeader from './AdsHeader';
import Pagination from './Pagination';

import './styles/Ads.css'

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

  const [moderator, loadingModerator] = useModerator();
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [allAreChosen, setAllAreChosen] = useState(false);
  const toggleSelection = (id) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
    console.log(selectedIds);
  };
  const selectAll = () => {
    setSelectedIds(allAreChosen ? new Set() : new Set(ads.map(ad => ad.id)));
    setAllAreChosen(!allAreChosen);
  };

  const clearSelection = () => {
    setSelectedIds(new Set());
    setAllAreChosen(false);
  };
  const bulkApprove = async () => {
    if (selectedIds.size === 0) return;
    if (!moderator?.permissions?.includes("approve_ads")) {
      alert("У вас недостаточно прав");
      return;
    }

    try {
      selectedIds.forEach( async (id) => {
        await fetchData(`http://localhost:3001/api/v1/ads/${id}/approve`, { method: 'POST' });
      });
      clearSelection();
    } catch (err) {
      if (err instanceof TypeError) {
        console.error("Сетевая ошибка:", err.message);
      } else {
        console.error("Ошибка при одобрении объявления.", err.message);
      }
    }
  };


  // формирование строки запроса с фильтрами и сортировкой
  // получение ответа: сложный объект со списком объявлений и информацией о пагинации
  // сохранение индексов подходящих объявлений в localStorage для того, чтобы они были доступны на карточке товара
  // (для навигации от объявления к объявлению без перехода к списку)
  useEffect(() => {
    // во избежании излишней нагрузки сразу проверка на количество символов в поисковой строке:
    // если их меньше 3, то не делать новый запрос на сервер (return)
    if (search && search.length < 3) { return; }
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

    if (search && search.length >= 3) {
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
        localStorage.setItem('ids', JSON.stringify(data.ads.map(ad => ad.id)));
      } catch (err) {
        if (err instanceof TypeError) {
          console.error("Сетевая ошибка. TypeError:", err.message);
        } else {
          console.error("HTTP ошибка.", err.message);
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

  const sidebarParams = {
    selectedStatuses: selectedStatuses,
    setSelectedStatuses: setSelectedStatuses,
    selectedCategory: selectedCategory,
    setSelectedCategory: setSelectedCategory,
    minSelectedPrice: minSelectedPrice,
    setMinSelectedPrice: setMinSelectedPrice,
    maxSelectedPrice: maxSelectedPrice,
    setMaxSelectedPrice: setMaxSelectedPrice,
    isSidebarOpen: isSidebarOpen
  };
  const adsHeaderParams = {
    sortBy: sortBy, 
    setSortBy: setSortBy,
    sortOrder: sortOrder, 
    setSortOrder: setSortOrder,
    limit: limit, 
    changeLimit: changeLimit,
    selectedIds: selectedIds,
    allAreChosen: allAreChosen,
    selectAll: selectAll,
    moderator: moderator
  };
  const paginationParams = {
    totalItems, curPage, 
    totalPages, goTo
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
      <Sidebar {...sidebarParams}/>

      <div>
        <AdsHeader {...adsHeaderParams}/>
        <div className="ad-list">
          {ads.map(ad => (
            <AdPreview key={ad.id} ad={ad} isSelected={selectedIds.has(ad.id)} onToggle={() => {toggleSelection(ad.id)}} />
          ))}
          <Pagination {...paginationParams}/>

        </div>
      </div>
    </div>
    </>
  );
}
