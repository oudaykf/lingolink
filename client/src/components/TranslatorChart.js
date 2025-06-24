import React, { useEffect, useRef } from 'react';
import './TranslatorChart.css';

const TranslatorChart = ({ data }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    // Load Chart.js dynamically
    const loadChartJs = async () => {
      try {
        // Dynamic import of Chart.js
        const Chart = await import('chart.js/auto');
        
        // If there's an existing chart, destroy it
        if (chartInstance.current) {
          chartInstance.current.destroy();
        }

        // Create the chart
        const ctx = chartRef.current.getContext('2d');
        chartInstance.current = new Chart.default(ctx, {
          type: 'bar',
          data: {
            labels: data.months,
            datasets: [
              {
                label: 'Tasks',
                data: data.tasks,
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
              },
              {
                label: 'Pages',
                data: data.pages,
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: 'Count'
                }
              },
              x: {
                title: {
                  display: true,
                  text: 'Month'
                }
              }
            },
            plugins: {
              legend: {
                position: 'top',
              },
              title: {
                display: true,
                text: 'Tasks and Pages by Month'
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    let label = context.dataset.label || '';
                    if (label) {
                      label += ': ';
                    }
                    if (context.parsed.y !== null) {
                      label += context.parsed.y;
                    }
                    return label;
                  }
                }
              }
            }
          }
        });
      } catch (error) {
        console.error('Error loading Chart.js:', error);
        
        // Fallback to a simple HTML representation if Chart.js fails to load
        const canvas = chartRef.current;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.font = '14px Arial';
        ctx.fillStyle = '#333';
        ctx.textAlign = 'center';
        ctx.fillText('Chart could not be loaded', canvas.width / 2, canvas.height / 2);
      }
    };

    loadChartJs();

    // Cleanup function
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data]);

  return (
    <div className="translator-chart-container">
      <canvas ref={chartRef} className="translator-chart"></canvas>
    </div>
  );
};

export default TranslatorChart;
