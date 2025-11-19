// ========================================================================================
// Компонент с графиком распределения решений, pie чарт
// ========================================================================================

import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

export default function DecisionsChart({ data }) {
  // данные уже были загружены в родительском компоненте, поэтому передаем их
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  // отрисовка графика в canvas
  // за основу были взяты графики с https://www.w3schools.com/ai/ai_chartjs.asp, однако помогали нейросети
  useEffect(() => {
    const ctx = canvasRef.current.getContext("2d");

    chartRef.current = new Chart(ctx, {
      type: "pie",
      data: {
        labels: ["Одобрено", "Отклонено", "На доработку"],
        datasets: [
          {
            backgroundColor: ["green", "red", "orange"],
            data: [
              data.approved ?? 0,
              data.rejected ?? 0,
              data.requestChanges ?? 0,
            ],
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "right",
          },
        },
      },
    });

    return () => {
      if (chartRef.current) chartRef.current.destroy();
    };
  }, [data]);

  return (
    <div >
      <canvas ref={canvasRef}></canvas>
    </div>
  );
}
