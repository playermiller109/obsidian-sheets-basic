module.exports = {
  git: {
    commit: false,
  },
  github: {
    release: true,
    releaseName: "${version}",
    assets: [
      'main.js',
      'manifest.json',
      'styles.css',
      'sheets-basic.zip',
    ],
    proxy: process.env.HTTPS_PROXY,
  },
  npm: {
    publish: false,
  },
};