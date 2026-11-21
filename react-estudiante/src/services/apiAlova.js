import { createAlova } from 'alova';
import ReactHook from 'alova/react';
import adapterFetch from 'alova/fetch';

const baseURL = (
  import.meta.env.VITE_API_URL || 'http://localhost:3000'
).replace(/\/$/, '');

export const apiAlova = createAlova({
  baseURL,
  statesHook: ReactHook,
  requestAdapter: adapterFetch(),

  responded: (response) => {
    if (!response.ok) {
      throw new Error(`Error HTTP ${response.status}`);
    }

    return response.json();
  }
});
