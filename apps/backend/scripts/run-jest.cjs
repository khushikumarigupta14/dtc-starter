const { spawnSync } = require("node:child_process")
const { loadEnv } = require("@medusajs/framework/utils")

const [testType, ...args] = process.argv.slice(2)
if (!testType) {
  console.error("Usage: node scripts/run-jest.cjs <test-type> [...jest arguments]")
  process.exit(1)
}

loadEnv("test", process.cwd())

const jestBin = require.resolve("jest/bin/jest")
const env = { ...process.env }

if (testType.startsWith("integration:") && env.DATABASE_URL) {
  const databaseUrl = new URL(env.DATABASE_URL)
  env.DB_HOST ||= databaseUrl.hostname
  env.DB_PORT ||= databaseUrl.port || "5432"
  env.DB_USERNAME ||= decodeURIComponent(databaseUrl.username)
  env.DB_PASSWORD ||= decodeURIComponent(databaseUrl.password)
}

const result = spawnSync(process.execPath, [jestBin, ...args], {
  env: {
    ...env,
    TEST_TYPE: testType,
    NODE_OPTIONS: [process.env.NODE_OPTIONS, "--experimental-vm-modules"]
      .filter(Boolean)
      .join(" "),
  },
  stdio: "inherit",
})

if (result.error) throw result.error
process.exit(result.status ?? 1)
