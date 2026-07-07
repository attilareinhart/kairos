import { demoOrderData, type DemoOrderRecord } from './demo-data';
import { type EntityKey, type MetricKey } from './config';

export type QueryFilters = {
  warehouse_id?: string;
  shift?: DemoOrderRecord['shift'];
  date_from?: string;
  date_to?: string;
};

export type KpiResult = Record<MetricKey, number>;

export type PlannedQueryResult = {
  kpis: Partial<KpiResult>;
  rows: (DemoOrderRecord & { late_order_rate: number })[];
  grouped: { label: string; dimensions: Partial<Record<EntityKey, string>>; metrics: Partial<KpiResult> }[];
};

const entityField: Partial<Record<EntityKey, keyof DemoOrderRecord>> = {
  Warehouse: 'warehouse_name',
  Shift: 'shift',
  Time: 'order_date'
};

function aggregate(records: DemoOrderRecord[], metrics: MetricKey[]): Partial<KpiResult> {
  const totalOrders = records.reduce((sum, row) => sum + row.orders_count, 0);
  const lateOrders = records.reduce((sum, row) => sum + row.late_orders_count, 0);
  const units = records.reduce((sum, row) => sum + row.units_shipped, 0);
  const values: KpiResult = {
    total_orders: totalOrders,
    late_orders: lateOrders,
    late_order_rate: totalOrders === 0 ? 0 : lateOrders / totalOrders,
    units_shipped: units
  };

  return Object.fromEntries(metrics.map((metric) => [metric, values[metric]])) as Partial<KpiResult>;
}

export function planSemanticQuery({
  entities,
  filters = {},
  metrics
}: {
  entities: EntityKey[];
  filters?: QueryFilters;
  metrics: MetricKey[];
}): PlannedQueryResult {
  const filtered = demoOrderData.filter((row) => {
    const warehouseMatch = !filters.warehouse_id || row.warehouse_id === filters.warehouse_id;
    const shiftMatch = !filters.shift || row.shift === filters.shift;
    const fromMatch = !filters.date_from || row.order_date >= filters.date_from;
    const toMatch = !filters.date_to || row.order_date <= filters.date_to;

    return warehouseMatch && shiftMatch && fromMatch && toMatch;
  });

  const rows = filtered.map((row) => ({
    ...row,
    late_order_rate: row.orders_count === 0 ? 0 : row.late_orders_count / row.orders_count
  }));

  const groupFields = entities.map((entity) => entityField[entity]).filter(Boolean) as (keyof DemoOrderRecord)[];
  const buckets = new Map<string, DemoOrderRecord[]>();

  for (const row of filtered) {
    const key = groupFields.length ? groupFields.map((field) => row[field]).join(' | ') : 'All orders';
    buckets.set(key, [...(buckets.get(key) ?? []), row]);
  }

  return {
    kpis: aggregate(filtered, metrics),
    rows,
    grouped: Array.from(buckets.entries()).map(([label, records]) => ({
      label,
      dimensions: Object.fromEntries(
        entities.map((entity) => {
          const field = entityField[entity];
          return [entity, field ? String(records[0]?.[field] ?? label) : label];
        })
      ),
      metrics: aggregate(records, metrics)
    }))
  };
}
