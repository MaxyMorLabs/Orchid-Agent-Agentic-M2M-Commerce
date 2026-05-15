const axios = {
  get: jest.fn().mockResolvedValue({ data: { status: 'running', activities: [] } }),
  post: jest.fn().mockResolvedValue({ data: {} }),
};

export default axios;
