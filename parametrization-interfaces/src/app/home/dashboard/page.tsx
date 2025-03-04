'use client';
import { BarChart } from '@mui/x-charts/BarChart';
import { PieChart } from '@mui/x-charts/PieChart';

import { axisClasses } from '@mui/x-charts/ChartsAxis';
import { dataset, valueFormatter } from './dataset';


const chartSetting = {
    yAxis: [
      {
        label: 'rainfall (mm)',
      },
    ],
    width: 500,
    height: 300,
    sx: {
      [`.${axisClasses.left} .${axisClasses.label}`]: {
        transform: 'translate(-20px, 0)',
      },
    },
  };


export default function Dashboard() {
    const items = [
        {
            id: 1,
            name: "Plantillas",
            value: 2,
            icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M20 0H4a2 2 0 0 0-2 2v20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2m0 22H4V2h16Z"/><path fill="currentColor" d="M6 4h12v2H6zm0 4h7v2H6zm2 12h8l-4-3zm11-1v-6l-5 3zM6 13v6l4-3zm10-1H8l4 3z"/></svg>
        },
        {
            id: 2,
            name: "Procesado",
            value: 62,
            icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M6.992 14.502a1 1 0 0 0-1 1v1.782a7.97 7.97 0 0 1-2-5.282a7 7 0 0 1 .052-.88a1 1 0 1 0-1.985-.24a9 9 0 0 0-.067 1.12a9.96 9.96 0 0 0 2.417 6.5H2.992a1 1 0 1 0 0 2h4a.98.98 0 0 0 .794-.422l.037-.043c.007-.01.007-.022.013-.032a1 1 0 0 0 .106-.258a1 1 0 0 0 .032-.156c.003-.03.018-.057.018-.089v-4a1 1 0 0 0-1-1m1.5-8.5H6.709a7.97 7.97 0 0 1 5.283-2a7 7 0 0 1 .88.053a1 1 0 0 0 .24-1.987a9 9 0 0 0-1.12-.066a9.96 9.96 0 0 0-6.5 2.417V3.002a1 1 0 0 0-2 0v4a1 1 0 0 0 .039.195a1 1 0 0 0 .141.346l.012.017a1 1 0 0 0 .244.246c.011.008.017.02.028.028c.014.01.03.013.045.021a1 1 0 0 0 .18.084a1 1 0 0 0 .261.053c.018 0 .032.01.05.01h4a1 1 0 0 0 0-2m11.96 10.804a1 1 0 0 0-.141-.345l-.011-.017a1 1 0 0 0-.245-.246c-.011-.008-.016-.02-.028-.028c-.01-.007-.023-.007-.034-.014a1.2 1.2 0 0 0-.41-.136c-.032-.003-.059-.018-.091-.018h-4a1 1 0 0 0 0 2h1.782a7.97 7.97 0 0 1-5.282 2a7 7 0 0 1-.88-.054a1 1 0 0 0-.24 1.987a9 9 0 0 0 1.12.067a9.96 9.96 0 0 0 6.5-2.417v1.417a1 1 0 0 0 2 0v-4a1 1 0 0 0-.04-.195Zm.54-11.304a1 1 0 0 0 0-2h-4a1 1 0 0 0-.192.039l-.007.001a1 1 0 0 0-.34.14l-.02.013a1 1 0 0 0-.245.244c-.008.01-.02.016-.028.027c-.007.01-.007.023-.014.034a1.2 1.2 0 0 0-.136.413c-.003.03-.018.057-.018.089v4a1 1 0 1 0 2 0V6.719a7.98 7.98 0 0 1 2 5.283a7 7 0 0 1-.053.88a1 1 0 0 0 .872 1.113a1 1 0 0 0 .122.007a1 1 0 0 0 .991-.88a9 9 0 0 0 .068-1.12a9.96 9.96 0 0 0-2.417-6.5Z"/></svg>
        },
        {
            id: 3,
            name: "Correcto",
            value: 60,
            icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 36 36"><path fill="currentColor" d="M18 2a16 16 0 1 0 16 16A16 16 0 0 0 18 2m0 30a14 14 0 1 1 14-14a14 14 0 0 1-14 14" className="clr-i-outline clr-i-outline-path-1"/><path fill="currentColor" d="M28 12.1a1 1 0 0 0-1.41 0l-11.1 11.05l-6-6A1 1 0 0 0 8 18.53L15.49 26L28 13.52a1 1 0 0 0 0-1.42" className="clr-i-outline clr-i-outline-path-2"/><path fill="none" d="M0 0h36v36H0z"/></svg>
        },
        {
            id: 4,
            name: "Incorrecto",
            value: 2,
            icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 48 48"><g fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="4"><path d="M5 8a2 2 0 0 1 2-2h12l5 6h17a2 2 0 0 1 2 2v26a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2z"/><path strokeLinecap="round" d="m19 22l10 10m0-10L19 32"/></g></svg>
        },
    ]

  return (
    <article className="flex flex-col items-center min-h-screen w-full gap-10 h-full p-8">
        <section className="flex flex-col h-fit w-full gap-4 px-8 pt-8 bg-secondary-200">
            <h1 className="text-4xl text-left font-bold text-primary-950">Dashboard</h1>
            <article className="flex flex-col h-fit w-full gap-10">

                <section className="group/item flex flex-row flex-wrap justify-between items-center h-fit w-full gap-20 p-8">
                    {items.map((item) => (
                    <div key={item.id} className="flex flex-col justify-center rounded-md gap-4 w-96 h-fit p-8 bg-white text-primary-950 hover:text-secondary-200 hover:bg-primary-950">
                        <div className="flex flex-row justify-between">
                            <h1 className="text-xl font-bold">{item.name}</h1>
                            <span className="rounded-full p-2 bg-primary-100 text-primary-950">{item.icon}</span>
                        </div>
                        <p className="text-2xl font-bold">{item.value}</p>
                        <span className="text-sm text-gray-500 group-hover/edit:text-white">Desde el mes pasado.</span>
                    </div>
                    ))}
                </section>
            </article>
        </section>
        <section className="flex flex-row justify-center items-center h-fit w-full gap-4 p-8">
            <article className='flex flex-col justify-start items-start gap-5'>
                <h1 className='text-2xl text-primary-950'>Estadisticas</h1>
                <BarChart
                    colors={['#181349', '#98c5fe', '#e1ffa9']}
                    xAxis={[
                        {
                        id: 'barCategories',
                        data: ['bar A', 'bar B', 'bar C'],
                        scaleType: 'band',
                        },
                    ]}
                    series={[
                        {
                        data: [2, 5, 3],
                        },
                    ]}
                    width={500}
                    height={300}
                    
                    />
            </article>

            <article className='flex flex-col justify-start items-start gap-5'>
                <h1 className='text-2xl text-primary-950'>Estadisticas 2</h1>
                <BarChart
                dataset={dataset}
                xAxis={[{ scaleType: 'band', dataKey: 'month' }]}
                series={[
                    { dataKey: 'london', label: 'London', valueFormatter },
                    { dataKey: 'paris', label: 'Paris', valueFormatter },
                    { dataKey: 'newYork', label: 'New York', valueFormatter },
                    { dataKey: 'seoul', label: 'Seoul', valueFormatter },
                ]}
                {...chartSetting}
                />
            </article>

            <article className='flex flex-col justify-start items-start gap-5'>
                <h1 className='text-2xl text-primary-950'>Estadisticas 3</h1>
                <PieChart
                    colors={['#181349', '#98c5fe', '#e1ffa9']}
                    series={[
                        {
                        data: [
                            { id: 0, value: 10, label: 'series A', color: '#181349' },
                            { id: 1, value: 15, label: 'series B', color: '#98c5fe' },
                            { id: 2, value: 20, label: 'series C', color: '#e1ffa9' },
                        ],
                        },
                    ]}
                    width={400}
                    height={200}
                    />
            </article>


                
            </section>
    </article>
  );
}