import server from '../dist/server/server.js';

export default async function(request) {
  try {
    if (request.url) {
      return await server.fetch(request);
    }
  } catch (err) {
    return new Response(err.stack || err.toString(), { status: 500 });
  }
}
