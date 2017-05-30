const https = require('https')
const fs = require('fs')
const qs = require('querystring')
const xml2js = require('xml2js').parseString

/**
 * Native https request with Promise return
 */
function request (host, cacert, method, path, headers, data = null, options = null) {
  let requestOptions = {
    hostname: host,
    path: path,
    headers: headers,
    method: method,
    ca: [fs.readFileSync(cacert)],
    checkServerIdentity: function (host, cert) {
      if (host !== cert.subject.CN) return 'Incorrect server identity'
    }
  }

  requestOptions = Object.assign(requestOptions, requestDefaultOptions, options)

  return new Promise((resolve, reject) => {
    let req = https.request(requestOptions, (res) => {
      let body = ''

      if (requestOptions.errorWithHTTPError) {
        if (!is2xxStatus(res.statusCode)) {
          if (requestOptions.includeResponse) return reject(res)
          return reject('Request error: ' + res.statusCode + ' ' + res.statusMessage)
        }
      }

      res.on('data', (d) => {
        body += d
      })

      res.on('end', () => {
        body = requestOptions.transformBody(body)

        if (requestOptions.includeResponse) {
          res.body = body
          return resolve(res)
        }

        resolve(body)
      })
    })

    req.on('error', (e) => {
      reject(e)
    })

    if (data !== null) {
      req.write(qs.stringify(data))
    }

    req.end()
  })
}

request.reponseTransformBody = {
  xml: data => {
    return new Promise((resolve, reject) => {
      xml2js(data, (err, res) => {
        if (err) return reject(err)
        resolve(res)
      })
    })
  },
  json: data => {
    return JSON.parse(data)
  },
  text: data => data
}

const requestDefaultOptions = {
  transformBody: request.reponseTransformBody.json,
  errorWithHTTPError: true,
  includeResponse: false
}

/**
 * Test 2xx status
 */
let is2xxStatus = function (statusCode) {
  return /^2[0-9][0-9]$/.test(statusCode)
}

module.exports = request
