import  { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
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

import {TransactionTimeSeries} from "../../models/Transaction"
import { useTranslation } from "react-i18next";



ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  TimeScale,
  TimeSeriesScale,
  Tooltip,
  Legend
);



interface IBarChartProps {
  transactions: TransactionTimeSeries[];
  predictedTransactions: TransactionTimeSeries[];
}



const BarChart  = ( props: IBarChartProps ) => {

  const {t} = useTranslation();

  const [filteredData, setFilteredData] = useState<TransactionTimeSeries[]>([]);
  const [showPredictions, setShowPredictions] = useState(false); 



  useEffect(() => {
    setFilteredData(filterTransactions(props.transactions, 3)); 
  }, [props.transactions]);

  useEffect(() => {
    showWithPredictions(filteredData); 
  }, [showPredictions]);


  const filterTransactions = (data: TransactionTimeSeries[], months: number): TransactionTimeSeries[] => {
    const cutoffDate = new Date();
    cutoffDate.setMonth(cutoffDate.getMonth() - months);
    return data.filter(transaction => new Date(transaction.datetime) >= cutoffDate);
  };

  const showWithPredictions = (data: TransactionTimeSeries[]): TransactionTimeSeries[] => {
    return data.concat(props.predictedTransactions);
  };



  const data = {
    labels: filteredData.map(transaction => transaction.datetime),
    datasets: [
      {
        label: t('spending_label'),
        data: filteredData.map(transaction => ({
          x: transaction.datetime,
          y: parseFloat(transaction.sum)
        })),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      },
      showPredictions && {
        label: 'Predicted',
        data: props.predictedTransactions.map(transaction => ({
          x: transaction.datetime,
          y: parseFloat(transaction.sum)
        })),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      }
    ].filter(Boolean) as any[] ,
  };

  const handleTimeFrameChange = (months: number) => {
    setFilteredData(filterTransactions(props.transactions, months));
  };


  

  return (
    <Box sx={{ width: '100%', textAlign: 'center' }}>
      <Typography variant="h4" gutterBottom>
        {t('spending_bar_chart')}
      </Typography>

      {   filteredData.length > 5 ?  
      <Bar options={options} data={data} />
      :
      <Typography variant="h4">
      Not Enough Data
    </Typography> 
      } 
      
      <ButtonGroup variant="contained" aria-label="outlined primary button group">
        <Button onClick={() => handleTimeFrameChange(3)}>Last 3 Months</Button>
        <Button onClick={() => handleTimeFrameChange(6)}>Last 6 Month</Button>
        <Button onClick={() => setShowPredictions(!showPredictions)}>
        {showPredictions ? 'Hide Predictions' : 'Show Predictions'}
      </Button>
      </ButtonGroup>
    </Box>
  );
};

const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      }
    },
    scales: {
      x: {
        type: 'time' as const,
        time: {
          unit: 'month' as const,
          tooltipFormat: 'yyyy-MM-dd'
        },
        title: {
          display: true,
          text: 'Date'
        },
        beginAtZero: false,

      },
      y: {
        title: {
          display: true,
          text: 'Spendings'
        },
        beginAtZero: false
      }
    },
    elements: {
      bar: {
        borderWidth: 2,
        borderRadius: 4,
        borderSkipped: false
      }
    },
    barThickness: 'flex',
    maxBarThickness: 80,
  };
  

export default BarChart;
