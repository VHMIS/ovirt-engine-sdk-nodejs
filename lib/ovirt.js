let request = require('./request')

const API_VERSION = 4
const API_TOKEN = '/ovirt-engine/sso/oauth/token'
const API_SERVICE = '/ovirt-engine/api/'
const API_SERVICE_HOSTS = 'hosts'
const API_SERVICE_VMS = 'vms'

function OVIRT () {}

OVIRT.prototype.connection = async function (host, cacert, username, password = null) {
  this.host = host
  this.toke = ''
  this.init = false
  this.password = password
  this.username = username
  this.token = ''
  this.cacert = cacert

  if (!password) {
    this.toke = username
    this.password = this.username = ''
  }

  if (!this.token) this.token = await this.getToken()

  this.init = true
}

OVIRT.prototype.getToken = async function () {
  if (this.init) {
    return
  }

  let data = {
    grant_type: 'password',
    scope: 'ovirt-app-api',
    username: this.username,
    password: this.password
  }

  let headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Accept': 'application/json'
  }

  let token = await request(this.host, this.cacert, 'POST', API_TOKEN, headers, data).then((body) => {
    return body.access_token
  })

  return token
}

module.exports = new OVIRT()

let defaultApiRequestHeader = {
  Version: API_VERSION,
  Accept: 'application/xml'
}

/**
 * GET, POST, PUT, DELETE request for service
 */
OVIRT.prototype.get = function (path, headers = {}) {
  // Add authorization data to header
  headers = Object.assign(defaultApiRequestHeader, headers, {Authorization: 'Bearer ' + this.token})

  return request(this.host, this.cacert, 'GET', API_SERVICE + path, headers, null, {
    transformBody: request.reponseTransformBody.xml
  })
}

OVIRT.prototype.post = function () {}
OVIRT.prototype.delete = function () {}
OVIRT.prototype.put = function () {}

// Services
OVIRT.prototype.vmsList = async function () {
  let res = await this.get(API_SERVICE_VMS)
  return res.vms.vm
}

OVIRT.prototype.hostsList = async function () {
  let res = await this.get(API_SERVICE_HOSTS)
  return res.hosts.host
}
