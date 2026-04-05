const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const path = require('path');

const root = path.resolve(__dirname, '../..');
const appNodeModules = path.resolve(__dirname, 'node_modules');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
  watchFolders: [root],
  resolver: {
    nodeModulesPaths: [
      appNodeModules,
      path.resolve(root, 'node_modules'),
    ],
    disableHierarchicalLookup: true,
    extraNodeModules: new Proxy({}, {
      get: (_, name) => path.resolve(appNodeModules, name),
    }),
    resolveRequest: (context, moduleName, platform) => {
      if (moduleName === '@devraj-labs/rn-storage-kit') {
        return { filePath: path.resolve(root, 'src/index.ts'), type: 'sourceFile' };
      }
      return context.resolveRequest(context, moduleName, platform);
    },
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
