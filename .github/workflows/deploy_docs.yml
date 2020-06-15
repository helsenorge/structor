name: Deploy documentation

on:
push:
branches: - master

jobs:
build:
runs-on: ubuntu-latest
steps: - name: Checkout
uses: actions/checkout@v1

      - name: Set Node.js
        uses: actions/setup-node@v1
        with:
          node-version: 10.x

      - name: Install npm dependencies
        working-directory: ./docs
        run: npm install

      - name: Run tests
        working-directory: ./docs
        continue-on-error: false
        run: npm run test

      - name: Deploy pages
        working-directory: ./docs
        run: |
          git config --global user.name "Helsenorge doc"
          git config --global user.email "doc@tor.com"
          npx gatsby build --prefix-paths && npx gh-pages -d public -r https://${{ secrets.GH_TOKEN }}@github.com/helsenorge/structor.git
