import type { UserConfigExport } from '@tarojs/cli';

export default {
  logger: {
    quiet: false,
    stats: true,
  },
  mini: {},
  h5: {
    devServer: {
      host: process.env.TARO_APP_HOST,
      port: process.env.TARO_APP_PORT,
    },
  },
} satisfies UserConfigExport;
