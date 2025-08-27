'use client';
import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { PieChart } from '@mui/x-charts/PieChart';
import { lineElementClasses } from '@mui/x-charts/LineChart';
import { axisClasses } from '@mui/x-charts/ChartsAxis';
import { ChartsLegend } from '@mui/x-charts/ChartsLegend';

// Si ya tienes estos helpers, impórtalos. Los dejo opcionales para que compile sin ellos.
// import { dataset, valueFormatter } from './dataset';
const dataset = [
  { month: 'Ene', london: 59, paris: 57, newYork: 86, seoul: 21 },
  { month: 'Feb', london: 50, paris: 52, newYork: 78, seoul: 28 },
  { month: 'Mar', london: 47, paris: 53, newYork: 106, seoul: 41 },
  { month: 'Abr', london: 54, paris: 56, newYork: 92, seoul: 73 },
  { month: 'May', london: 57, paris: 69, newYork: 92, seoul: 99 },
];
const valueFormatter = (v: number | null) => (v == null ? '' : `${v}`);

const chartSetting = {
  yAxis: [
    {
      label: 'Eventos',
    },
  ],
  height: 300,
  sx: {
    [`.${axisClasses.left} .${axisClasses.label}`]: {
      transform: 'translate(-14px, 0)'
    },
  },
};

export default function Dashboard() {
  const items = [
    { id: 1, name: 'Plantillas', value: 2, icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M20 0H4a2 2 0 0 0-2 2v20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2m0 22H4V2h16Z"/><path fill="currentColor" d="M6 4h12v2H6zm0 4h7v2H6zm2 12h8l-4-3zm11-1v-6l-5 3zM6 13v6l4-3zm10-1H8l4 3z"/></svg>
    )},
    { id: 2, name: 'Procesado', value: 62, icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M6.992 14.502a1 1 0 0 0-1 1v1.782a7.97 7.97 0 0 1-2-5.282a7 7 0 0 1 .052-.88a1 1 0 1 0-1.985-.24a9 9 0 0 0-.067 1.12a9.96 9.96 0 0 0 2.417 6.5H2.992a1 1 0 1 0 0 2h4a.98.98 0 0 0 .794-.422l.037-.043c.007-.01.007-.022.013-.032a1 1 0 0 0 .106-.258a1 1 0 0 0 .032-.156c.003-.03.018-.057.018-.089v-4a1 1 0 0 0-1-1m1.5-8.5H6.709a7.97 7.97 0 0 1 5.283-2a7 7 0 0 1 .88.053a1 1 0 0 0 .24-1.987a9 9 0 0 0-1.12-.066a9.96 9.96 0 0 0-6.5 2.417V3.002a1 1 0 0 0-2 0v4a1 1 0 0 0 .039.195a1 1 0  0 .141.346l.012.017a1 1 0 0 0 .244.246c.011.008.017.02.028.028c.014.01.03.013.045.021a1 1 0 0 0 .18.084a1 1 0 0 0 .261.053c.018 0 .032.01.05.01h4a1 1 0 0 0 0-2m11.96 10.804a1 1 0 0 0-.141-.345l-.011-.017a1 1 0 0 0-.245-.246c-.011-.008-.016-.02-.028-.028c-.01-.007-.023-.007-.034-.014a1.2 1.2 0 0 0-.41-.136c-.032-.003-.059-.018-.091-.018h-4a1 1 0 0 0 0 2h1.782a7.97 7.97 0 0 1-5.282 2a7 7 0  0 1-.88-.054a1 1 0 0 0-.24 1.987a9 9 0 0 0 1.12.067a9.96 9.96 0 0 0 6.5-2.417v1.417a1 1 0 0 0 2 0v-4a1 1 0 0 0-.04-.195Zm.54-11.304a1 1 0 0 0 0-2h-4a1 1 0 0 0-.192.039l-.007.001a1 1 0 0 0-.34.14l-.02.013a1 1 0 0 0-.245.244c-.008.01-.02.016-.028.027c-.007.01-.007.023-.014.034a1.2 1.2 0 0 0-.136.413c-.003.03-.018.057-.018.089v4a1 1 0 1 0 2 0V6.719a7.98 7.98 0 0 1 2 5.283a7 7 0 0 1-.053.88a1 1 0 0 0 .872 1.113a1 1 0 0 0 .122.007a1 1 0 0 0 .991-.88a9 9 0 0 0 .068-1.12a9.96 9.96 0 0 0-2.417-6.5Z"/></svg>
    )},
    { id: 3, name: 'Correcto', value: 60, icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 36 36"><path fill="currentColor" d="M18 2a16 16 0 1 0 16 16A16 16 0 0 0 18 2m0 30a14 14 0 1 1 14-14a14 14 0 0 1-14 14"/><path fill="currentColor" d="M28 12.1a1 1 0 0 0-1.41 0l-11.1 11.05l-6-6A1 1 0 0 0 8 18.53L15.49 26L28 13.52a1 1 0 0 0 0-1.42"/></svg>
    )},
    { id: 4, name: 'Incorrecto', value: 2, icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 48 48"><g fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="4"><path d="M5 8a2 2 0 0 1 2-2h12l5 6h17a2 2 0 0 1 2 2v26a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2z"/><path strokeLinecap="round" d="m19 22l10 10m0-10L19 32"/></g></svg>
    )},
  ];

  return (
    <main className="flex w-full flex-col gap-8 p-6 sm:p-8">
      {/* Encabezado */}
      <section className="rounded-2xl border border-secondary-200 bg-gradient-to-br from-secondary-100 to-secondary-200 p-6">
        <h1 className="text-left text-3xl font-bold tracking-tight text-primary-950">Dashboard</h1>
        <p className="mt-1 text-sm text-primary-800/80">Resumen general y estadísticas</p>
      </section>

      {/* KPI cards */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {items.map((kpi) => (
          <div
            key={kpi.id}
            className="group rounded-2xl border border-secondary-200 bg-white p-5 shadow-sm transition hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-primary-700/70">{kpi.name}</p>
                <p className="mt-1 text-3xl font-bold text-primary-950">{kpi.value}</p>
              </div>
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-700">
                {kpi.icon}
              </span>
            </div>
            <p className="mt-2 text-xs text-primary-700/70">Comparado con el mes pasado</p>
          </div>
        ))}
      </section>

      {/* Grillas de charts */}
      <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Chart 1 */}
        <article className="rounded-2xl border border-secondary-200 bg-white p-4 shadow-sm">
          <h2 className="mb-3 text-base font-semibold text-primary-950">Estadísticas</h2>
          <div className="overflow-x-auto">
            <BarChart
              xAxis={[{ id: 'barCategories', data: ['A', 'B', 'C'], scaleType: 'band' }]}
              series={[{ data: [2, 5, 3], label: 'Series' }]}
              colors={['#3b82f6']}
              width={520}
              height={300}
              margin={{ left: 60, right: 20, top: 20, bottom: 40 }}
              slotProps={{
                legend: { hidden: true },
              }}
              sx={{
                [`& .${axisClasses.left} .${axisClasses.label}`]: { transform: 'translate(-10px, 0)' },
              }}
            />
          </div>
        </article>

        {/* Chart 2 (con dataset) */}
        <article className="rounded-2xl border border-secondary-200 bg-white p-4 shadow-sm xl:col-span-2">
          <h2 className="mb-3 text-base font-semibold text-primary-950">Estadísticas 2</h2>
          <div className="overflow-x-auto">
            <BarChart
              dataset={dataset}
              xAxis={[{ scaleType: 'band', dataKey: 'month' }]}
              series={[
                { dataKey: 'london', label: 'Londres', valueFormatter },
                { dataKey: 'paris', label: 'París', valueFormatter },
                { dataKey: 'newYork', label: 'New York', valueFormatter },
                { dataKey: 'seoul', label: 'Seúl', valueFormatter },
              ]}
              colors={['#1d4ed8', '#3b82f6', '#60a5fa', '#93c5fd']}
              height={300}
              margin={{ left: 70, right: 20, top: 20, bottom: 40 }}
              slotProps={{
                legend: { direction: 'row', position: { horizontal: 'middle', vertical: 'top' } },
              }}
              sx={{
                [`& .${axisClasses.left} .${axisClasses.label}`]: { transform: 'translate(-14px, 0)' },
              }}
            />
          </div>
        </article>

        {/* Chart 3 */}
        <article className="rounded-2xl border border-secondary-200 bg-white p-4 shadow-sm">
          <h2 className="mb-3 text-base font-semibold text-primary-950">Estadísticas 3</h2>
          <PieChart
            series={[
              {
                data: [
                  { id: 0, value: 10, label: 'Serie A' },
                  { id: 1, value: 15, label: 'Serie B' },
                  { id: 2, value: 20, label: 'Serie C' },
                ],
                innerRadius: 30,
                paddingAngle: 2,
                cornerRadius: 3,
              },
            ]}
            height={260}
            slotProps={{ legend: { direction: 'row', position: { horizontal: 'middle', vertical: 'bottom' } } }}
          />
        </article>
      </section>
    </main>
  );
}
