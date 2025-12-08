export const Endpoints = {
  rfp: {
    create: 'rfp',
    getAll: 'rfp/all',
  },
  vendor: {
    getAll: 'vendor',
    notify: 'vendor/notify',
  },
  proposal: {
    evaluate: (rfpId: string) => `proposal/${rfpId}/evaluate`,
  },
};
