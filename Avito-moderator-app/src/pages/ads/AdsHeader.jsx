import './styles/AdsHeader.css'
import { useState } from 'react';
import { fetchApprove, fetchReject, fetchRequestChanges } from '../../utils/fetchData';

const reasonsReject = [
  "Запрещенный товар",
  "Неверная категория",
  "Некорректное описание",
  "Проблемы с фото",
  "Подозрение на мошенничество",
  "Другое",
];

export default function AdsHeader({
  sortBy, setSortBy,
  sortOrder, setSortOrder,
  limit, changeLimit,
  selectedIds, allAreChosen, 
  selectAll, moderator
}) {
  const [showApproveForm, setShowApproveForm] = useState(false);
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [showRequestChangesForm, setShowRequestChangesForm] = useState(false);
  const [reason, setReason] = useState(reasonsReject[0]);
  const [comment, setComment] = useState('');
  

  const handleApprove = () => {
    selectedIds.forEach( async(id) => {
      const result = await fetchApprove({ moderator, id });
      if (!result) {
        alert("Ошибка во время одобрения объявления.");
      } else {
        window.location.reload();
      };
    });
  }

  const handleReject = () => {
    selectedIds.forEach( async(id) => {
      const body = { 'reason': reason, 'comment': comment.trim() };
      const result = await fetchReject({ moderator, id, body });
      if (result) {
        window.location.reload();
      } else {
        alert('Ошибка во время отклонения объявления.');
      }
    });
  }

  const handleRequestChanges = () => {
    selectedIds.forEach( async(id) => {
      const body = { 'reason': reason, 'comment': comment.trim() };
      const result = await fetchRequestChanges({ moderator, id, body });
      if (result) {
        window.location.reload();
      } else {
        alert('Ошибка во время отклонения объявления.');
      }
    });
  }

  return (
  <div className='ads-header'>
  <div className="sorting-container" id='pageBeginning'>
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

    <div className='pagination-block'>
      <label>Единиц на странице:  </label>
      <input type="number" value={limit}
        onChange={changeLimit}/>
    </div>   
  </div>
  <div className='bulk-container'>
    <label> Выбрать все 
      <input type="checkbox" checked={allAreChosen ? true : false} onChange={() => { selectAll(); }}/>
      <span className="checkmark"></span>
    </label>
    {selectedIds.size !== 0 && (
      <label className='chosen-amount'> Выбрано: {selectedIds.size}</label>
    )}

    <div className='bulk-actions'>
        <button className='pannel-approve' onClick={() => { 
          setShowApproveForm(!showApproveForm); 
          setShowRejectForm(false);
          setShowRequestChangesForm(false);
        }}>Одобрить выбранные</button>
        <button className='pannel-reject' onClick={() => { 
          setShowRejectForm(!showRejectForm); 
          setShowApproveForm(false);
          setShowRequestChangesForm(false);
        }}>Отклонить выбранные</button>
        <button className='pannel-rewrite' onClick={() => { 
          setShowRequestChangesForm(!showRequestChangesForm); 
          setShowApproveForm(false);
          setShowRejectForm(false);
        }}>Отправить выбранные на доработку</button>
      </div>

    {/* {selectedIds.length && (
      <></>
    )} */}

    {showApproveForm && (
      <div className='forms'>
        <form className='approve-form' onSubmit={handleApprove}>
          <label> Вы уверены что хотите одобрить все выбранные объявления?</label> <br />
          <div className='send-container'>
            <button onClick={() => {setShowApproveForm(false)}}>Отмена</button>
            <button type='submit' className='pannel-approve'>Одобрить</button>
          </div>
        </form>
      </div>
    )}
    {showRejectForm && (
      <div className='forms'>
        <form className='reject-form' onSubmit={handleReject}
              style={{'width': '80%'}}>
          <label> Вы уверены что хотите отклонить все выбранные объявления? </label> <br />
          
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

          <div className='send-container'>
            <button onClick={() => {setShowRejectForm(false)}}>Отмена</button>
            <button type='submit' className='pannel-reject'>Отклонить</button>
          </div>
        </form>
      </div>
    )}
    {showRequestChangesForm && (
      <div className='forms'>
        <form className='request-changes-form' onSubmit={handleRequestChanges}
              style={{'width': '80%'}}>
          <label> Вы уверены что хотите отправить на доработку все выбранные объявления?</label> <br />

          <label>Выберите причину отклонения (обязательно):</label>
          <select required value={reason} onChange={(e) => setReason(e.target.value)} >
            {reasonsReject.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>

          <label>
            Комментарий (обязательно)
          </label>
          <textarea value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Дайте автору комментарий"
          />

          <div className='send-container'>
            <button onClick={() => {setShowRequestChangesForm(false)}}>Отмена</button>
            <button type='submit' className='pannel-rewrite'>На доработку</button>
          </div>
        </form>
      </div>
    )}
    
  </div>  
  </div>
  );
}