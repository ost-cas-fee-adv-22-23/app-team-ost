window.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserver: jest.fn(),
  disconnect: jest.fn(),
}));
