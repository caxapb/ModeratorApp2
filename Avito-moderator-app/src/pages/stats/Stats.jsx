// ========================================================================================
// Компонент для статистики. Собирает в себе страницу из более мелких компонентов-чартов
// Получает данные с сервера, формирует элементы сам или передает данные в компоненты дальше
// Включает в себя фильтр по периоду: сегодня/неделя/месяц, в зависимости от периода формирует
// запросы на сервер
// ========================================================================================

import React, { useState, useEffect } from 'react';
import ChartCategories from './CategoriesChart';
import DecisionsChart from './DecisionChart';
import ActivityBarChart from './ActivityChart';
import './Stats.css'

export default function Stats() {
  const [stats, setStats] = useState({});
  const [decisions, setDecisions] = useState([]);
  const [period, setPeriod] = useState('today');
  const [categories, setCategories] = useState({});

  // запросы к серверу с указанием выбранного периода
  useEffect(() => {
    fetch(`http://localhost:3001/api/v1/stats/summary?period=${period}`)
      .then(res => res.json())
      .then(data => {
        setStats(data);
        return fetch(`http://localhost:3001/api/v1/stats/chart/decisions?period=${period}`);
      })
      .then(res => res.json())
      .then(data => {
        setDecisions(data);
        return fetch(`http://localhost:3001/api/v1/stats/chart/categories?period=${period}`);
      }).then(res => res.json())
      .then(data => {
        setCategories(data);
      });
  }, [period]);

  return (
    <div className="stats-page">
      <h1>Статистика модератора</h1>

      <div className="period-container">
        Период:
        <button className={period === 'today' ? 'active' : ''}
          onClick={() => setPeriod('today')}> Сегодня </button>
        <button className={period === 'week' ? 'active' : ''}
          onClick={() => setPeriod('week')}> Неделя </button>
        <button className={period === 'month' ? 'active' : ''}
          onClick={() => setPeriod('month')}> Месяц </button>
      </div>

      <div className='simple-stats'>
        <p>Всего проверено: <br />{stats.totalReviewedToday}</p>
        <p>Одобренных: <br />{Math.round(stats.approvedPercentage)}%</p>
        <p>Отклоненных: <br />{Math.round(stats.rejectedPercentage)}%</p>
        <p>Среднее время: <br />{stats.averageReviewTime} мин</p>
      </div>

      <div className='charts'>
        <h3>Графики активности</h3>
        <h4>Столбчатые диаграммы активности</h4>
        <div className='activity-charts'>
          <ActivityBarChart period="week"/>
          <ActivityBarChart period="month" />
        </div>
        
        <h4>Круговая диаграмма распределения решений </h4>
        <DecisionsChart data={decisions} />

        <h4>График по категориям проверенных объявлений </h4>
        <div className='categories-chart'>
          <ChartCategories data={categories} />
        </div>
      </div>
    </div>
  );
}
