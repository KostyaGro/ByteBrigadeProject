install:
	npm ci

publish:
	npm publish --dry-run

lint:
	npx eslint .
	npx stylelint "**/*.css"