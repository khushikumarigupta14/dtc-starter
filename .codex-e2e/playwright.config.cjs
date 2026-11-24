module.exports = {
  testDir: ".",
  timeout: 60_000,
  use: {
    baseURL: "http://localhost:8000",
    channel: "chrome",
    headless: true,
    viewport: { width: 1440, height: 1000 },
  },
}
