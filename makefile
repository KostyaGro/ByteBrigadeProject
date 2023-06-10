
start:
	npx nodemon index.js

install:
	npm ci

publish:
	npm publish --dry-run

lint:
	npx eslint .
	npx stylelint "**/*.css"

fix-lint:
	npx eslint . --fix