import React, { useEffect, useState } from 'react';
import { Chart } from 'react-google-charts';
import { getTotalAudience } from '../api/api';
import '../css/Audience.css';



const channelIds = [
  'UCP391YRAjSOdM_bwievgaZA',
  'UCXRIQok8uzYtg1TPwSqikVg',
  'UCKDjjeeBmdaiicey2nImISw',
  'UCvdwhh_fDyWccR42-rReZLw'
];
//att

const AudienceChart = () => {
  const [data, setData] = useState([['Time', ...channelIds.map(() => '')]]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeData = async () => {
      try {
        const audienceData = await getTotalAudience(channelIds);
        const channelNames = audienceData.map(({ channelName }) => channelName);
        setData([['Time', ...channelNames]]);
      } catch (error) {
        console.error('Error initializing data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeData();
  }, []);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const audienceData = await getTotalAudience(channelIds);
        const currentTime = new Date().toLocaleTimeString();

        setData(prevData => {
          if (prevData.length === 1) {
            const channelNames = audienceData.map(({ channelName }) => channelName);
            return [['Time', ...channelNames], [currentTime, ...audienceData.map(({ totalViewers }) => totalViewers)]];
          }

          const lastRow = [currentTime, ...audienceData.map(({ totalViewers }) => totalViewers)];
          return [...prevData.slice(0, -1), lastRow];
        });
      } catch (error) {
        console.error('Error updating data:', error);
      }
    }, 60000); // Atualiza a cada minuto

    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="audience-chart">
      <h2>Audiência ao vivo</h2>
      <Chart
      
        chartType="BarChart"
        data={data}
        width="90%"
        height="calc(100vh - 100px)" 
        options={{
          chartArea: { width: '70%', height: '80%' }, 
          hAxis: {
            title: 'Tempo',
            textStyle: { color: '#FFFFFF' }, 
            titleTextStyle: { color: '#FFFFFF' } 
          },
          vAxis: {
            title: 'Audiência',
            textStyle: { color: '#FFFFFF' }, 
            titleTextStyle: { color: '#FFFFFF' } 
          },
          legend: {
            position: 'bottom',
            textStyle: { color: '#FFFFFF' }
          },
          backgroundColor: '#1c1c1c'
        }}
      />
    </div>
  );
};


export default AudienceChart;
