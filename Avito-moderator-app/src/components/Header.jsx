// ========================================================================================
// Компонент хедера, общий для всех страниц. Содержит лого, строку для поиска, ссылки на
// другие страницы и информацию о пользователе
// Поиск осуществляется через параметры url, использую useSearchParams
// ========================================================================================

import { useModerator } from '../hooks/useModerator';
import { NavLink, useSearchParams } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import UserImg from '../assets/user2.png'
import './Header.css'

export default function Header() {
  const { moderator, loading } = useModerator();
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get('search') || '';

  const inputRef = useRef(null);

  // Хендлер keydown, слушает какие клавиши были нажаты, проверяет нужно ли переводить фокус на элемент поиска
  function keydownSearchHandler(e) {
    if (e.target.tagName === 'INPUT') return; 
    if (e.key === '/') {
      // чтобы ИМЕННО ЭТОТ символ не напечатался в окно ввода, а при нажатии фокус переводился на окно поиска
      e.preventDefault(); 
      inputRef.current ? inputRef.current.focus() : '';
    }
    return;
  }
  useEffect(() => {
    window.addEventListener('keydown', keydownSearchHandler);
    return () => window.removeEventListener('keydown', keydownSearchHandler);
  }, []);

  // Хендлер поиска, следит за содержимым в input, обновляет параметры url и состояние
  const handleSearch = (e) => {
    const value = e.target.value;
    if (!value) {
      searchParams.delete('search');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ search: value });
    }
  };

  if (loading) return <header className="header">Загрузка...</header>;

  return (
    <header className="header">
      <div className='web-name-container'>
        <img src="/avito-logo-white-background.png" alt="" />
        <p className='web-name'>Moderator</p>
      </div>

      <div className='search-container'>
        <input type="text" placeholder="Поиск..." value={search} onChange={handleSearch} ref={inputRef}/> 
        <button className='search-button' type='button'>
          <img src="/search-icon.png" alt="" />
        </button>
      </div>

      <div className='right-section-container'>
        <div className='navigation-container'>
          <nav>
            <NavLink to="/list">Список объявлений</NavLink>
            {moderator?.permissions.includes("view_stats") && (
            <NavLink to="/stats">Статистика</NavLink>
            )}
          </nav>
        </div>
          
        <div className='user-info'>
          {moderator && <span>{moderator.name}</span>}
          <img className="user-image" src={UserImg} alt="user image" />
        </div>
      </div>
    </header>
  );
}
