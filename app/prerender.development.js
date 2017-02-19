// development prerender
// may be used to speed up development builds/rebuilds
// just renders template without any server-side prerender
// handles everything on the client

import template from 'app/template.html'

function renderPage(statics = {}) {
  return template({
    html: '',
    initialState: '{}',
    statics,
    GLOBALS,
  })
}

export default function prerenderDevelopment(req, res, statics = {}) {
  res.send(renderPage(statics))
}
