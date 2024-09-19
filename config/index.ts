import type { UserConfigExport } from '@tarojs/cli';
import { defineConfig } from '@tarojs/cli';
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';
import devConfig from './dev';
import prodConfig from './prod';

const baseConfig: UserConfigExport = {
  projectName: 'antm-reproduce',
  framework: 'react',
  compiler: {
    type: 'webpack5',
    prebundle: { enable: false },
  },
  cache: { enable: false },
  sourceRoot: 'src',
  outputRoot: `dist/${process.env.TARO_ENV}`,
  deviceRatio: {
    375: 2,
    640: 2.34 / 2,
    750: 1,
    828: 1.81 / 2,
  },
  designWidth(input) {
    if ((input as any)?.file?.replace(/\\+/g, '/').indexOf('@antmjs/vantui') > -1) {
      return 750;
    }
    return 375;
  },
  plugins: [
    ['@tarojs/plugin-framework-react', { reactMode: 'concurrent' }],
  ],
  h5: {
    router: { mode: 'hash' },
    esnextModules: ['@antmjs/vantui'],
    publicPath: '',
    staticDirectory: 'static',
    output: {
      filename: 'js/[name].[hash:8].js',
      chunkFilename: 'js/[name].[chunkhash:8].js',
    },
    miniCssExtractPluginOption: {
      ignoreOrder: true,
      filename: 'css/[name].[hash].css',
      chunkFilename: 'css/[name].[chunkhash].css',
    },
    postcss: {
      pxtransform: {
        enable: true,
        config: {
          onePxTransform: false, // H5必要设置， 否则边框等样式会出现问题
          unitPrecision: 5, // rem 单位允许的小数位
          propList: ['*', '!border-radius'], // 允许转换的属性
          selectorBlackList: [], // 黑名单里的选择器将会被忽略，不做转换处理
          replace: true, // 直接替换而不是追加一条进行覆盖
          mediaQuery: false, // 允许媒体查询里的 px 单位转换
          minPixelValue: 2, // H5可选设置， 否则边框2px等样式会出现问题
        },
      },
      autoprefixer: {
        enable: true,
        config: {},
      },
    },
    webpackChain(chain) {
      chain.resolve.plugin('tsconfig-paths').use(TsconfigPathsPlugin);
    },
  },
};

// https://taro-docs.jd.com/docs/next/config#defineconfig-辅助函数
export default defineConfig((merge) => {
  if (process.env.NODE_ENV === 'development') {
    // 本地开发构建配置（不混淆压缩）
    return merge({}, baseConfig, devConfig);
  }
  // 生产构建配置（默认开启压缩混淆等）
  return merge({}, baseConfig, prodConfig);
});
