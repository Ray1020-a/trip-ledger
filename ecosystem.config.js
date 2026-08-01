module.exports = {
  apps: [
    {
      name: "trip-ledger",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 30002",
      cwd: __dirname,
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        PORT: 30002,
      },
      autorestart: true,
      max_restarts: 10,
      out_file: "./logs/pm2-out.log",
      error_file: "./logs/pm2-error.log",
      merge_logs: true,
      time: true,
    },
  ],
};
