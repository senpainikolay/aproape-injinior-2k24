import  { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  TimeScale,
  TimeSeriesScale,
  Tooltip,
  Legend
} from 'chart.js';
import 'chartjs-adapter-date-fns'; // needed for time scale
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import {TransactionBalanceTimeSeries} from "../../models/Transaction"


ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  TimeScale,
  TimeSeriesScale,
  Tooltip,
  Legend
);



interface ILineChartProps {
  transactions: TransactionBalanceTimeSeries[];
}

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    tooltip: {
      mode: 'index' as const, // Ensure this is a valid string literal
      intersect: false,
    },
  },
  scales: {
    x: {
      type: 'time' as const, // Ensure this is a valid string literal
      time: {
        unit: 'month' as const, // Ensure this is a valid string literal
        tooltipFormat: 'yyyy-MM-dd'
      },
      title: {
        display: true,
        text: 'Date'
      }
    },
    y: {
      beginAtZero: true,
      title: {
        display: true,
        text: 'Balance ($)'
      }
    }
  }
};

const SpendingLineChart  = ( props: ILineChartProps ) => {

  const [filteredData, setFilteredData] = useState<TransactionBalanceTimeSeries[]>([]);

  useEffect(() => {
    setFilteredData(filterTransactions(props.transactions, 6)); // Default to last 6 months
  }, [props.transactions]);

  const filterTransactions = (data: TransactionBalanceTimeSeries[], months: number): TransactionBalanceTimeSeries[] => {
    const cutoffDate = new Date();
    cutoffDate.setMonth(cutoffDate.getMonth() - months);
    return data.filter(transaction => new Date(transaction.datetime) >= cutoffDate);
  };

  const data = {
    labels: filteredData.map(transaction => transaction.datetime),
    datasets: [
      {
        label: 'Account Balance',
        data: filteredData.map(transaction => ({
          x: transaction.datetime,
          y: parseFloat(transaction.balance)
        })),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      }
    ],
  };

  const handleTimeFrameChange = (months: number) => {
    setFilteredData(filterTransactions(props.transactions, months));
  };

  return (
    <Box sx={{ width: '100%', textAlign: 'center' }}>
      <Typography variant="h4" gutterBottom>
        Spending Behavior Line Chart
      </Typography>
      <Line options={options} data={data} />
      <ButtonGroup variant="contained" aria-label="outlined primary button group">
        <Button onClick={() => handleTimeFrameChange(6)}>Last 6 Months</Button>
        <Button onClick={() => handleTimeFrameChange(12)}>Last 12 Months</Button>
      </ButtonGroup>
    </Box>
  );
};

export default SpendingLineChart;