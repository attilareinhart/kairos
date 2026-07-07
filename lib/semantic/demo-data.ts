export type DemoOrderRecord = {
  warehouse_id: string;
  warehouse_name: string;
  shift: 'Morning' | 'Swing' | 'Night';
  order_date: string;
  orders_count: number;
  late_orders_count: number;
  units_shipped: number;
};

export const demoOrderData: DemoOrderRecord[] = [
  { warehouse_id: 'WH-ATL', warehouse_name: 'Atlanta Fulfillment', shift: 'Morning', order_date: '2026-06-24', orders_count: 420, late_orders_count: 18, units_shipped: 1260 },
  { warehouse_id: 'WH-ATL', warehouse_name: 'Atlanta Fulfillment', shift: 'Swing', order_date: '2026-06-24', orders_count: 365, late_orders_count: 21, units_shipped: 1095 },
  { warehouse_id: 'WH-ATL', warehouse_name: 'Atlanta Fulfillment', shift: 'Night', order_date: '2026-06-25', orders_count: 288, late_orders_count: 16, units_shipped: 835 },
  { warehouse_id: 'WH-DEN', warehouse_name: 'Denver Crossdock', shift: 'Morning', order_date: '2026-06-24', orders_count: 335, late_orders_count: 11, units_shipped: 940 },
  { warehouse_id: 'WH-DEN', warehouse_name: 'Denver Crossdock', shift: 'Swing', order_date: '2026-06-25', orders_count: 390, late_orders_count: 24, units_shipped: 1188 },
  { warehouse_id: 'WH-DEN', warehouse_name: 'Denver Crossdock', shift: 'Night', order_date: '2026-06-26', orders_count: 252, late_orders_count: 20, units_shipped: 790 },
  { warehouse_id: 'WH-NWK', warehouse_name: 'Newark Sort Center', shift: 'Morning', order_date: '2026-06-25', orders_count: 510, late_orders_count: 29, units_shipped: 1645 },
  { warehouse_id: 'WH-NWK', warehouse_name: 'Newark Sort Center', shift: 'Swing', order_date: '2026-06-26', orders_count: 470, late_orders_count: 33, units_shipped: 1510 },
  { warehouse_id: 'WH-NWK', warehouse_name: 'Newark Sort Center', shift: 'Night', order_date: '2026-06-27', orders_count: 310, late_orders_count: 27, units_shipped: 990 },
  { warehouse_id: 'WH-PHX', warehouse_name: 'Phoenix Logistics', shift: 'Morning', order_date: '2026-06-26', orders_count: 295, late_orders_count: 9, units_shipped: 875 },
  { warehouse_id: 'WH-PHX', warehouse_name: 'Phoenix Logistics', shift: 'Swing', order_date: '2026-06-27', orders_count: 340, late_orders_count: 14, units_shipped: 1012 },
  { warehouse_id: 'WH-PHX', warehouse_name: 'Phoenix Logistics', shift: 'Night', order_date: '2026-06-28', orders_count: 220, late_orders_count: 13, units_shipped: 675 },
  { warehouse_id: 'WH-ATL', warehouse_name: 'Atlanta Fulfillment', shift: 'Morning', order_date: '2026-06-28', orders_count: 445, late_orders_count: 15, units_shipped: 1368 },
  { warehouse_id: 'WH-DEN', warehouse_name: 'Denver Crossdock', shift: 'Swing', order_date: '2026-06-28', orders_count: 405, late_orders_count: 18, units_shipped: 1205 },
  { warehouse_id: 'WH-NWK', warehouse_name: 'Newark Sort Center', shift: 'Morning', order_date: '2026-06-29', orders_count: 535, late_orders_count: 22, units_shipped: 1708 },
  { warehouse_id: 'WH-PHX', warehouse_name: 'Phoenix Logistics', shift: 'Night', order_date: '2026-06-29', orders_count: 238, late_orders_count: 10, units_shipped: 712 }
];
