'use client';

import { useMemo, useState } from 'react';
import { semanticConfig, type MetricKey } from '../../lib/semantic/config';
import { demoOrderData } from '../../lib/semantic/demo-data';
import { planSemanticQuery, type QueryFilters } from '../../lib/semantic/planner';

const metrics: MetricKey[] = ['total_orders', 'late_orders', 'late_order_rate', 'units_shipped'];
const dateOptions = Array.from(new Set(demoOrderData.map((row) => row.order_date))).sort();
const warehouseOptions = Array.from(new Map(demoOrderData.map((row) => [row.warehouse_id, row.warehouse_name])).entries());
const shiftOptions = Array.from(new Set(demoOrderData.map((row) => row.shift)));

function formatMetric(metric: MetricKey, value = 0) {
  if (semanticConfig.metrics[metric].format === 'percent') {
    return `${(value * 100).toFixed(1)}%`;
  }

  return new Intl.NumberFormat('en-US').format(value);
}

export default function SemanticDemoPage() {
  const [warehouseId, setWarehouseId] = useState('');
  const [shift, setShift] = useState('');
  const [dateFrom, setDateFrom] = useState(dateOptions[0] ?? '');
  const [dateTo, setDateTo] = useState(dateOptions.at(-1) ?? '');

  const filters: QueryFilters = {
    warehouse_id: warehouseId || undefined,
    shift: shift ? (shift as QueryFilters['shift']) : undefined,
    date_from: dateFrom || undefined,
    date_to: dateTo || undefined
  };

  const result = useMemo(
    () => planSemanticQuery({ entities: ['Warehouse'], filters, metrics }),
    [warehouseId, shift, dateFrom, dateTo]
  );

  const timeSeries = useMemo(
    () => planSemanticQuery({ entities: ['Time'], filters, metrics: ['late_order_rate'] }).grouped,
    [warehouseId, shift, dateFrom, dateTo]
  );

  const unitsByWarehouse = useMemo(
    () => planSemanticQuery({ entities: ['Warehouse'], filters, metrics: ['units_shipped'] }).grouped,
    [warehouseId, shift, dateFrom, dateTo]
  );

  const maxUnits = Math.max(...unitsByWarehouse.map((item) => item.metrics.units_shipped ?? 0), 1);
  const polylinePoints = timeSeries
    .map((item, index) => {
      const x = timeSeries.length === 1 ? 50 : (index / (timeSeries.length - 1)) * 100;
      const y = 90 - (item.metrics.late_order_rate ?? 0) * 900;
      return `${x},${Math.max(8, Math.min(90, y))}`;
    })
    .join(' ');

  return (
    <section className="space-y-8">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[var(--accent)]">Semantic demo</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--ink)]">Warehouse KPI planner</h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-[var(--muted)]">
          This page asks a separated semantic config for entities, filters, relationships, and metrics, then plans an aggregated KPI query against static demo data.
        </p>
      </div>

      <form className="grid gap-4 rounded-3xl border border-[var(--border)] bg-white/55 p-5 md:grid-cols-4">
        <label className="flex flex-col gap-2 text-sm font-semibold text-[var(--ink)]">
          Warehouse
          <select value={warehouseId} onChange={(event) => setWarehouseId(event.target.value)} className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 font-medium">
            <option value="">All warehouses</option>
            {warehouseOptions.map(([id, name]) => <option key={id} value={id}>{name}</option>)}
          </select>
        </label>
        <label className="flex flex-col gap-2 text-sm font-semibold text-[var(--ink)]">
          Shift
          <select value={shift} onChange={(event) => setShift(event.target.value)} className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 font-medium">
            <option value="">All shifts</option>
            {shiftOptions.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>
        <label className="flex flex-col gap-2 text-sm font-semibold text-[var(--ink)]">
          From
          <select value={dateFrom} onChange={(event) => setDateFrom(event.target.value)} className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 font-medium">
            {dateOptions.map((date) => <option key={date} value={date}>{date}</option>)}
          </select>
        </label>
        <label className="flex flex-col gap-2 text-sm font-semibold text-[var(--ink)]">
          To
          <select value={dateTo} onChange={(event) => setDateTo(event.target.value)} className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 font-medium">
            {dateOptions.map((date) => <option key={date} value={date}>{date}</option>)}
          </select>
        </label>
      </form>

      <div className="grid gap-4 md:grid-cols-4">
        {metrics.map((metric) => (
          <article key={metric} className="rounded-3xl border border-[var(--border)] bg-white/70 p-5 shadow-sm">
            <p className="text-sm font-semibold text-[var(--muted)]">{semanticConfig.metrics[metric].label}</p>
            <p className="mt-3 text-3xl font-bold text-[var(--ink)]">{formatMetric(metric, result.kpis[metric])}</p>
            <p className="mt-2 text-xs text-[var(--muted)]">{semanticConfig.metrics[metric].expression}</p>
          </article>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <article className="rounded-3xl border border-[var(--border)] bg-white/60 p-5">
          <h2 className="text-xl font-semibold">Late order rate over time</h2>
          <svg viewBox="0 0 100 100" role="img" aria-label="Late order rate over time chart" className="mt-4 h-56 w-full overflow-visible rounded-2xl bg-[var(--surface)] p-3">
            <polyline fill="none" stroke="var(--accent)" strokeWidth="3" points={polylinePoints} />
            {timeSeries.map((item, index) => {
              const x = timeSeries.length === 1 ? 50 : (index / (timeSeries.length - 1)) * 100;
              const y = Math.max(8, Math.min(90, 90 - (item.metrics.late_order_rate ?? 0) * 900));
              return <circle key={item.label} cx={x} cy={y} r="2.5" fill="var(--header-bg)" />;
            })}
          </svg>
          <div className="mt-3 flex flex-wrap gap-2 text-xs text-[var(--muted)]">
            {timeSeries.map((item) => <span key={item.label}>{item.label}: {formatMetric('late_order_rate', item.metrics.late_order_rate)}</span>)}
          </div>
        </article>

        <article className="rounded-3xl border border-[var(--border)] bg-white/60 p-5">
          <h2 className="text-xl font-semibold">Units shipped by warehouse</h2>
          <div className="mt-5 space-y-4">
            {unitsByWarehouse.map((item) => (
              <div key={item.label}>
                <div className="mb-1 flex justify-between text-sm font-semibold"><span>{item.label}</span><span>{formatMetric('units_shipped', item.metrics.units_shipped)}</span></div>
                <div className="h-4 rounded-full bg-[var(--border)]"><div className="h-4 rounded-full bg-[var(--accent-soft)]" style={{ width: `${((item.metrics.units_shipped ?? 0) / maxUnits) * 100}%` }} /></div>
              </div>
            ))}
          </div>
        </article>
      </div>

      <article className="overflow-hidden rounded-3xl border border-[var(--border)] bg-white/65">
        <div className="border-b border-[var(--border)] p-5"><h2 className="text-xl font-semibold">Detailed order rows</h2></div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-[var(--header-bg)] text-[var(--header-text)]"><tr>{['Date', 'Warehouse', 'Shift', 'Orders', 'Late', 'Late rate', 'Units'].map((heading) => <th key={heading} className="px-4 py-3 font-semibold">{heading}</th>)}</tr></thead>
            <tbody>
              {result.rows.map((row) => (
                <tr key={`${row.warehouse_id}-${row.shift}-${row.order_date}`} className="border-t border-[var(--border)]">
                  <td className="px-4 py-3">{row.order_date}</td><td className="px-4 py-3">{row.warehouse_name}</td><td className="px-4 py-3">{row.shift}</td><td className="px-4 py-3">{formatMetric('total_orders', row.orders_count)}</td><td className="px-4 py-3">{formatMetric('late_orders', row.late_orders_count)}</td><td className="px-4 py-3">{formatMetric('late_order_rate', row.late_order_rate)}</td><td className="px-4 py-3">{formatMetric('units_shipped', row.units_shipped)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  );
}
