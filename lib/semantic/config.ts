export type EntityKey = 'Warehouse' | 'Shift' | 'Time' | 'Order';
export type MetricKey = 'total_orders' | 'late_orders' | 'late_order_rate' | 'units_shipped';

export type SemanticEntity = {
  label: string;
  sourceFields: string[];
  relationships: { entity: EntityKey; type: string; description: string }[];
  filters: { key: string; label: string; field: string; operator: 'equals' | 'between' }[];
  metrics: MetricKey[];
};

export const semanticConfig: {
  source: { name: string; description: string };
  entities: Record<EntityKey, SemanticEntity>;
  metrics: Record<MetricKey, { label: string; description: string; expression: string; format: 'integer' | 'percent' }>;
} = {
  source: {
    name: 'demoOrderData',
    description: 'Static warehouse shift order performance data for semantic planning demos.'
  },
  entities: {
    Warehouse: {
      label: 'Warehouse',
      sourceFields: ['warehouse_id', 'warehouse_name'],
      relationships: [
        { entity: 'Order', type: 'one-to-many', description: 'A warehouse handles many order summary rows.' },
        { entity: 'Shift', type: 'many-to-many', description: 'Warehouses operate across several shifts.' }
      ],
      filters: [{ key: 'warehouse_id', label: 'Warehouse', field: 'warehouse_id', operator: 'equals' }],
      metrics: ['total_orders', 'late_orders', 'late_order_rate', 'units_shipped']
    },
    Shift: {
      label: 'Shift',
      sourceFields: ['shift'],
      relationships: [{ entity: 'Order', type: 'one-to-many', description: 'Each order summary row belongs to one shift.' }],
      filters: [{ key: 'shift', label: 'Shift', field: 'shift', operator: 'equals' }],
      metrics: ['total_orders', 'late_orders', 'late_order_rate', 'units_shipped']
    },
    Time: {
      label: 'Time',
      sourceFields: ['order_date'],
      relationships: [{ entity: 'Order', type: 'one-to-many', description: 'Dates group order summaries into time series.' }],
      filters: [{ key: 'order_date', label: 'Order date range', field: 'order_date', operator: 'between' }],
      metrics: ['total_orders', 'late_orders', 'late_order_rate', 'units_shipped']
    },
    Order: {
      label: 'Order',
      sourceFields: ['orders_count', 'late_orders_count', 'units_shipped'],
      relationships: [
        { entity: 'Warehouse', type: 'many-to-one', description: 'Order summaries roll up to a warehouse.' },
        { entity: 'Shift', type: 'many-to-one', description: 'Order summaries are measured by shift.' },
        { entity: 'Time', type: 'many-to-one', description: 'Order summaries are measured by order date.' }
      ],
      filters: [],
      metrics: ['total_orders', 'late_orders', 'late_order_rate', 'units_shipped']
    }
  },
  metrics: {
    total_orders: { label: 'Total orders', description: 'All orders processed in the selected slice.', expression: 'sum(orders_count)', format: 'integer' },
    late_orders: { label: 'Late orders', description: 'Orders that missed the expected service window.', expression: 'sum(late_orders_count)', format: 'integer' },
    late_order_rate: { label: 'Late order rate', description: 'Share of processed orders that were late.', expression: 'late_orders / total_orders', format: 'percent' },
    units_shipped: { label: 'Units shipped', description: 'Total units shipped for completed orders.', expression: 'sum(units_shipped)', format: 'integer' }
  }
};
