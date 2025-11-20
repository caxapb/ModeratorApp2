import './styles/Pagination.css'

export default function Pagination({
  totalItems, currentPage,
  totalPages, goTo
}) {
  return (
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
    <a className='upButton' href='#pageBeginning'>🠹</a>
  </div>
  );
}