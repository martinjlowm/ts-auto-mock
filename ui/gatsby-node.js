const WebpackCopyPlugin = require('copy-webpack-plugin');
const path = require('path');
const Dotenv = require('dotenv-webpack');
const development = 'development';
const activeEnv = process.env.NODE_ENV || development;

exports.onCreateWebpackConfig = ({
                                     stage,
                                     rules,
                                     loaders,
                                     plugins,
                                     actions,
                                 }) => {

    actions.setWebpackConfig({
        plugins: [
            new WebpackCopyPlugin([
                {
                    from: path.resolve('..', '..', 'data'),
                    to: 'resources'
                },
                {
                    from: path.resolve('..', '_config.yml'),
                    to: ''
                }
            ]),
            new Dotenv({
                path: resolveEnvironmentVariables(activeEnv)
            })
        ],
    });
};

function resolveEnvironmentVariables(env) {
    const isDevelopment = activeEnv === development;

    if (isDevelopment) {
        return path.resolve('..', '.env.development');
    }

    return path.resolve('..', '.env');
}
