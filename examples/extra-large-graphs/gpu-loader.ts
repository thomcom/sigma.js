/**
 * This example aims at showcasing sigma's performances.
 */

import arrow from 'apache-arrow';

async function request(obj) {
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest();
    xhr.open(obj.method || 'GET', obj.url || obj);
    if (obj.headers) {
      Object.keys(obj.headers).forEach(key => { xhr.setRequestHeader(key, obj.headers[key]); });
    }
    xhr.onload = () => {
      try {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(xhr.response);
        } else {
          reject(xhr.statusText);
        }
      } catch (e) { reject(e); }
    };
    xhr.onerror = () => reject(xhr.statusText);
    xhr.send(obj.body);
  });
}

const SERVER             = 'http://localhost:3000';
const DATASET_ROUTE      = '/graphology/read_large_demo?filename=../../public/fewer-edges.json';
const NODES_ROUTE        = '/graphology/get_column/nodes';
const NODES_BOUNDS_ROUTE = '/graphology/nodes/bounds';
const NODES_BUFFER_ROUTE = '/graphology/nodes/';
const EDGES_BUFFER_ROUTE = '/graphology/edges/';
const TABLE_ROUTE        = '/graphology/get_table';

const GpuLoader = {
  init: async ()          => request(SERVER + DATASET_ROUTE),
  getTable: async (table) => {
    return arrow.tableFromIPC(fetch(SERVER + TABLE_ROUTE + '/' + table, {method: 'GET'}));
  },
  getColumn: async (table, column) => {
    const table_route  = {'nodes': '/graphology/get_column/nodes/'}[table];
    const column_route = SERVER + table_route + column;
    return arrow.tableFromIPC(fetch(column_route, {method: 'GET'}));
  },
  getNodesBounds: async () => request(SERVER + NODES_BOUNDS_ROUTE),
  getNodesBuffer: async () => {
    const route = SERVER + NODES_BUFFER_ROUTE;
    return arrow.tableFromIPC(fetch(route, {method: 'GET'}));
  },
  getEdgesBuffer: async () => {
    const route = SERVER + EDGES_BUFFER_ROUTE;
    return arrow.tableFromIPC(fetch(route, {method: 'GET'}));
  }
};

export default GpuLoader;
