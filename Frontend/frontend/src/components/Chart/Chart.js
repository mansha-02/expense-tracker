import React from 'react'
import {
    Chart as ChartJs,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
    ArcElement
} from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import { Line, Pie } from 'react-chartjs-2'
import styled from 'styled-components'
import { useGlobalContext } from '../../context/globalContext'
import { dateFormat } from '../../utils/dateFormat'

// Register all necessary chart components
ChartJs.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
    ArcElement,
    ChartDataLabels
)

function Chart() {
    const { incomes, expenses } = useGlobalContext()

    const labels = incomes.map(inc => dateFormat(inc.date))

    // === Line Chart ===
    const lineData = {
        labels,
        datasets: [
            {
                label: 'Income',
                data: incomes.map(inc => inc.amount),
                borderColor: 'rgba(34,197,94,1)',
                backgroundColor: 'rgba(34,197,94,0.2)',
                fill: true,
                tension: 0.4,
                pointRadius: 4,
                pointHoverRadius: 6,
            },
            {
                label: 'Expenses',
                data: expenses.map(exp => exp.amount),
                borderColor: 'rgba(239,68,68,1)',
                backgroundColor: 'rgba(239,68,68,0.2)',
                fill: true,
                tension: 0.4,
                pointRadius: 4,
                pointHoverRadius: 6,
            }
        ]
    }

    const lineOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: { color: '#555', font: { size: 14, weight: 'bold' } }
            },
            tooltip: {
                backgroundColor: '#fff',
                titleColor: '#000',
                bodyColor: '#000',
                borderColor: '#ccc',
                borderWidth: 1,
            }
        },
        scales: {
            x: { grid: { color: '#eee' }, ticks: { color: '#888' } },
            y: { grid: { color: '#f0f0f0' }, ticks: { color: '#888' } }
        }
    }

    // === Pie Chart ===
    const totalIncome = incomes.reduce((acc, item) => acc + item.amount, 0)
    const totalExpenses = expenses.reduce((acc, item) => acc + item.amount, 0)
    const total = totalIncome + totalExpenses

    const pieData = {
        labels: ['Income', 'Expenses'],
        datasets: [
            {
                label: 'Balance Overview',
                data: [totalIncome, totalExpenses],
                backgroundColor: ['rgba(34,197,94,0.7)', 'rgba(239,68,68,0.7)'],
                borderColor: ['rgba(34,197,94,1)', 'rgba(239,68,68,1)'],
                borderWidth: 1
            }
        ]
    }

    const pieOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    font: { size: 14, weight: 'bold' },
                    color: '#333'
                }
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        const value = context.raw
                        const percent = ((value / total) * 100).toFixed(1)
                        return `${context.label}: ₹${value} (${percent}%)`
                    }
                }
            },
            datalabels: {
                color: '#fff',
                formatter: (value, context) => {
                    const percentage = ((value / total) * 100).toFixed(1)
                    return `${percentage}%`
                },
                font: {
                    weight: 'bold',
                    size: 14
                }
            }
        },
        animation: {
            animateRotate: true,
            animateScale: true
        }
    }

    return (
        <ChartStyled>
            <div className="chart-wrapper">
                <div className="line-chart">
                    <h3>Income & Expenses Over Time</h3>
                    <Line data={lineData} options={lineOptions} />
                </div>
                <div className="pie-chart">
                    <h3>Income vs Expenses</h3>
                    <Pie data={pieData} options={pieOptions} plugins={[ChartDataLabels]} />
                </div>
            </div>
        </ChartStyled>
    )
}

const ChartStyled = styled.div`
    
    padding: 2rem;
    border-radius: 16px;
    height: 100%;
    min-height: 400px;

    .chart-wrapper {
        display: flex;
        flex-direction: column;
        gap: 2rem;

        @media(min-width: 768px) {
            flex-direction: row;
            justify-content: space-between;
        }

        .line-chart, .pie-chart {
            flex: 1;
            h3 {
                font-size: 1.2rem;
                margin-bottom: 1rem;
                color: #333;
                text-align: center;
            }
        }

        canvas {
            max-height: 300px;
        }
    }
`

export default Chart
