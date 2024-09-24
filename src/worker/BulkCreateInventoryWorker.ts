import type { BulkCreateInventoryMessage } from '@/types/event';
import axios from 'axios';

onmessage = (event: MessageEvent<BulkCreateInventoryMessage>) => {
  const params = new URLSearchParams(event.data.params);

  axios.get(
    '',
    {
      ...event.data.config,
      params,
    },
  );
  console.log({
    event,
  });
};
