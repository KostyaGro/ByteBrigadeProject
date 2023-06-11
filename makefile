
start:
	npx nodemon index.js

install:
	npm ci

publish:
	npm publish --dry-run

lint:
	npx eslint . || exit 0
	npx prettier --check .

fix-lint:
	npx eslint . --fix || exit 0
	npx prettier --write .