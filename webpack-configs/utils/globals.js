import git from 'git-rev-sync'

export default {
  DEV: true,
  DEV_PRERENDER: false,
  BASE_URL: 'http://romanonthego.rocks',
  GA: false,
  GA_MODE: 'auto',
  LAST_COMMIT_LONG: git.long(),
  LAST_COMMIT_SHORT: git.short(),
  VERSION: process.env.npm_package_version,
}
