// ========================================================================================
// Компонент карточки товара, собирает воедино менее масштабные компоненты
// По ID из url строки получает с сервера данные о товаре
// Получает несколько id других товаров (из локального хранилища), которые были изображены
// на главной сранице (после поиска например) вместе с этим товаром. Необходимо для навигации
// по объявлениям прямо из этой карточки - стрелки назад и вперед
// Формирует слайдер из картинок, подробное описание товара, историю модерации и 
// панель модератора с возможностью принять/отклонить/отправить на доработку
// ========================================================================================


import AdDetails from "./AdDetails";
import ModeratorPannel from "./ModeratorPannel";
import ModerationHistory from "./ModerationHistory";
import { useParams, NavLink } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './AdCard.css'

export default function AdCard() {
  const { id } = useParams();
  const [ad, setAd] = useState(null);
  const [currentImg, setCurrentImg] = useState(0);
  const [prevId, setPrevId] = useState(null);
  const [nextId, setNextId] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3001/api/v1/ads/${id}`)
      .then(res => res.json())
      .then(data => setAd(data));
  }, [id]);

  // Получение индексов объявлений, которые идут вместе с текущим объявлением
  // для формирования навигации из страницы карточки (воизбежание необходимости возвращаться к списку)
  useEffect(() => {
    const ids = JSON.parse(localStorage.getItem('ids'));
    const idNumber = ids.findIndex(x => String(x) === String(id));
    setPrevId(idNumber > 0 ? ids[idNumber - 1] : ids[0]);
    setNextId(idNumber < ids.length - 1 ? ids[idNumber + 1] : ids[ids.length - 1]);
  }, [id]);
  

  if (!ad) return <div>Загрузка...</div>;
  const images = ad.images;

  return (
    <>
    <div className="back-to-list-container">
          <NavLink to={`/list`} className="back-to-list-button" >
          ◀ Назад к списку
      </NavLink>
    </div>

    {/* <button className="back-to-list-button" onClick={() => {window.history.back()}}>Назад к списку</button> */}
    <div className="ad-main-page">
      <div className="ad-info-container">
        <h2>{ad.title}</h2>
        {/* <img src={ad.images[0] || '../../assets/cat.jpg'} alt="advertisement image" /> */}
        <div className="image-slider">
          <button onClick={() => { 
            currentImg === 0 ? setCurrentImg(images.length - 1) : 
                setCurrentImg(currentImg - 1) }
          }>◀</button>
          
          <img src={images[currentImg]} alt="advertisement image" />
          <button onClick={() => { setCurrentImg((currentImg + 1) % images.length) }}>▶</button>
        </div>

        <AdDetails ad={ad}/>
      </div>

      <div className="ad-moderation-container">
        <ModerationHistory history={ad.moderationHistory}/>
        <ModeratorPannel id={id}/>
      </div>      
    </div>
    <div className="navigate-buttons">
      <NavLink to={`/item/${prevId}`} className="nav-button backward" >
      ◀ Предыдущее
      </NavLink>
      <NavLink to={`/item/${nextId}`} className="nav-button forward" >
        Следующее ▶
      </NavLink>
    </div>

        
    </>
  );
}
