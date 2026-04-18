const { serve } = require('@hono/node-server');
const { Hono } = require('hono');
const app = new Hono();

app.get('/', (c) => c.text('Hello Hono!'));

const port = process.env.PORT || 3000;
serve({ fetch: app.fetch, port }, () => {
  console.log('Server is running on port ' + port);
});
