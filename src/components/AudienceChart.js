import React, { useEffect, useState } from 'react';
import { Chart } from 'react-google-charts';
import { getTotalAudience } from '../api/api';
import { setApiKey } from '../api/youtubeApi';
import '../css/Audience.css';

const channelIds = [
  'UCP391YRAjSOdM_bwievgaZA',
  'UCXRIQok8uzYtg1TPwSqikVg',
  'UCKDjjeeBmdaiicey2nImISw',
  'UCvdwhh_fDyWccR42-rReZLw',
  'UCBQAI1ZhurW3nbtJR-gBBZg',
  'UCtCN9VVRR3fJolXWSbQ5oxw',
];

const colors = ['#A020F0', '#0a52b0', '#0ab047', '#f7f42f', '#d92ff7'];

const AudienceChart = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [apiKey, setApiKeyState] = useState('Nova Chave API');

  const fetchData = async () => {
    try {
      setApiKey(apiKey); // Atualiza a chave da API
      const audienceData = await getTotalAudience(channelIds);

      const updatedData = [['Canal', 'Audiência', { role: 'style' }, { role: 'annotation' }]];
      audienceData.forEach(({ channelName, totalViewers }, index) => {
        const color = colors[index % colors.length];
        updatedData.push([channelName, totalViewers, `stroke-color: #ffffff; stroke-width: 2; fill-color: ${color}`, totalViewers.toString()]);
      });

      setData(updatedData);
      setIsLoading(false);
      setError(null);
    } catch (error) {
      if (error.response && error.response.status === 403) {
        setError('Erro ao carregar os dados: acesso negado (403).');
      } else {
        setError('Erro ao carregar os dados.');
      }
      setIsLoading(true);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);

    return () => clearInterval(interval);
  }, [apiKey]);

  const handleFocus = (e) => {
    if (e.target.value === 'Nova Chave API') {
      e.target.value = '';
    }
  };

  const handleBlur = (e) => {
    if (e.target.value === '') {
      e.target.value = 'Nova Chave API';
    }
  };

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="audience-chart">
      <h2 style={{ color: '#A020F0' }}>Audiência ao vivo</h2>
      <input
        type="text"
        defaultValue="Nova Chave API"
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={(e) => setApiKeyState(e.target.value)}
        style={{ marginBottom: '20px', width: '50%', padding: '10px', borderRadius: '10px' }}
      />
      <button onClick={fetchData} style={{ marginBottom: '20px', padding: '10px 20px', color: '#ffff' }}>Atualizar</button>
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
          <button onClick={fetchData}>Recarregar</button>
        </div>
      )}
      <Chart
        chartType="BarChart"
        data={data}
        width="90%"
        height="calc(100vh - 100px)"
        options={{
          chartArea: { width: '70%', height: '80%' },
          hAxis: {
            title: 'Audiência',
            textStyle: { color: '#FFFFFF' },
            titleTextStyle: { color: '#FFFFFF' },
            gridlines: { color: '#444444' }
          },
          vAxis: {
            title: 'Canal',
            textStyle: { color: '#FFFFFF' },
            titleTextStyle: { color: '#FFFFFF' }
          },
          legend: {
            position: 'none',
            textStyle: { color: '#FFFFFF' }
          },
          annotations: {
            alwaysOutside: true,
            textStyle: {
              color: '#FFFFFF',
              fontSize: 20,
              bold: true,
            }
          },
          backgroundColor: '#1c1c1c',
          bar: { groupWidth: '75%' },
        }}
      />
    </div>
  );
};

export default AudienceChart;
