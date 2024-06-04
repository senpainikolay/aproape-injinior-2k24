import { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, PointElement, LineElement, TimeScale, TimeSeriesScale, Tooltip, Legend } from 'chart.js';
import 'chartjs-adapter-date-fns'; // needed for time scale
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import { TransactionTimeSeries } from "../../models/Transaction"
import { useTranslation } from "react-i18next";


ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  TimeScale,
  ArcElement,
  TimeSeriesScale,
  Tooltip,
  Legend
);

interface ILineChartProps {
  transactions: TransactionTimeSeries[];
  predictedTransactions: TransactionTimeSeries[]; // Add predictedTransactions to props
}

const PieChart = (props: ILineChartProps) => {
  const { t } = useTranslation();

  const [filteredData, setFilteredData] = useState<TransactionTimeSeries[]>([]);
  const [showPredictions, setShowPredictions] = useState(false);

  useEffect(() => {
    showPredictions ? setFilteredData(props.predictedTransactions) : setFilteredData(filterTransactions(props.transactions, 2));
  }, [props.transactions, showPredictions]);

  const filterTransactions = (data: TransactionTimeSeries[], years: number): TransactionTimeSeries[] => {
    const cutoffDate = new Date();
    cutoffDate.setFullYear(cutoffDate.getFullYear() - years);
    return data.filter(transaction => new Date(transaction.datetime) >= cutoffDate);
  };



  const categorizeDataByMonths = (data: TransactionTimeSeries[]): {[key: string]: number} => {
    const categorizedData: {[key: string]: number} = {};
    data.forEach(transaction => {
      const month = new Date(transaction.datetime).toLocaleString('en-us', { month: 'long' });
      categorizedData[month] = (categorizedData[month] || 0) + parseFloat(transaction.sum);
    });
    return categorizedData;
  };

  const data = {
    labels: Object.keys(categorizeDataByMonths(filteredData)),
    datasets: [
      {
        label: t('income_label'),
        data: Object.values(categorizeDataByMonths(filteredData)),
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)', // Red
          'rgba(54, 162, 235, 0.5)', // Blue
          'rgba(255, 206, 86, 0.5)', // Yellow
          'rgba(75, 192, 192, 0.5)', // Teal
          'rgba(153, 102, 255, 0.5)', // Purple
          'rgba(255, 159, 64, 0.5)', // Orange
          'rgba(255, 0, 0, 0.5)', // Bright Red
          'rgba(0, 128, 0, 0.5)', // Green
          'rgba(255, 215, 0, 0.5)', // Gold
          'rgba(0, 128, 128, 0.5)', // Sea Green
          'rgba(128, 0, 128, 0.5)', // Indigo
          'rgba(255, 165, 0, 0.5)', // Orange
      ],
      borderColor: [
          'rgba(255, 99, 132, 1)', // Red
          'rgba(54, 162, 235, 1)', // Blue
          'rgba(255, 206, 86, 1)', // Yellow
          'rgba(75, 192, 192, 1)', // Teal
          'rgba(153, 102, 255, 1)', // Purple
          'rgba(255, 159, 64, 1)', // Orange
          'rgba(255, 0, 0, 1)', // Bright Red
          'rgba(0, 128, 0, 1)', // Green
          'rgba(255, 215, 0, 1)', // Gold
          'rgba(0, 128, 128, 1)', // Sea Green
          'rgba(128, 0, 128, 1)', // Indigo
          'rgba(255, 165, 0, 1)', // Orange
      ],
        borderWidth: 3,
      },
    ],
  };

  const handleTimeFrameChange = (months: number) => {
    setShowPredictions(false)
    setFilteredData(filterTransactions(props.transactions, months));
  };

  return (
    <Box sx={{ alignItems: "center", alignContent: "center", textAlign: 'center' }}>
      <Typography variant="h4" gutterBottom>
        {t('income_pie_name')}
      </Typography> 

      {   filteredData.length > 5 ?  
       <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: "center", alignContent: "center", textAlign: 'center' }}>
      <Pie  options={options} data={data} width={550} height={550}  /> 
      </Box>
      :
      <Typography variant="h4">
      Not Enough Data
    </Typography> 
      } 
      <ButtonGroup sx={{marginTop: "2em"}} variant="contained" aria-label="outlined primary button group">
        <Button onClick={() => handleTimeFrameChange(1)}>This  Year</Button>
        <Button onClick={() => handleTimeFrameChange(2)}>Last 2 Years</Button>
        <Button onClick={() => setShowPredictions(!showPredictions)}>
          {showPredictions ? 'Hide Predictions' : 'Show Predictions'}
        </Button>
      </ButtonGroup>
    </Box>
  );
};


const options = {
  responsive: false,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    tooltip: {
      mode: 'index' as const, // Ensure this is a valid string literal
      intersect: false,
    },
  },
};



export default PieChart;
