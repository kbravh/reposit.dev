# Reposit

Reposit is _the_ place to keep track of repositories. Find some interesting repositories you want to keep an eye on for future projects? Need to keep a handy list of all the repositories your team manages? Need to manage bulk actions across multiple repositories? Whatever your need may be, Reposit is the tool for it.

## Feature Flags

This application uses [LaunchDarkly](https://launchdarkly.com/) for feature flag management. See [docs/LAUNCHDARKLY.md](docs/LAUNCHDARKLY.md) for setup instructions and usage examples.

Required environment variables:

- `LAUNCHDARKLY_CLIENT_SIDE_ID` - LaunchDarkly client-side ID
- `LAUNCHDARKLY_SDK_KEY` - LaunchDarkly server-side SDK key
