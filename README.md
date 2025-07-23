# Reposit

Reposit is _the_ place to keep track of repositories. Find some interesting repositories you want to keep an eye on for future projects? Need to keep a handy list of all the repositories your team manages? Whatever your need may be, Reposit is the tool for it.

## MVP Planned features

- add a GitHub repository to your list by its url or its `org/name`
- add tags to repositories
- create lists of repositories
  - by tags (include and/or exclude)
  - add or exclude individually
- manage common tasks via keyboard shortcuts to support power users

## GitHub Language Colors

Reposit automatically assigns colors to tags based on GitHub's language color scheme. When you create a tag with a title that matches a programming language name (like "JavaScript", "Python", "Go", etc.), the tag will automatically use the same color that GitHub uses for that language.

### Attribution

The language color data is sourced from [ozh/github-colors](https://github.com/ozh/github-colors) repository, which provides a comprehensive mapping of GitHub's language colors.

### Updating Colors

To sync our local copy with the latest GitHub language colors:

1. Download the latest colors.json file:

   ```bash
   curl -o src/data/colors.json https://raw.githubusercontent.com/ozh/github-colors/master/colors.json
   ```

2. The colors will be automatically available in the application after restart.

**Last Updated**: July 2025

## Future ideas

- Support repositories from BitBucket and other repository sites
