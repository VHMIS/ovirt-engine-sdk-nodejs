# Nodejs SDK for oVirt Engine

Nodejs SDK for oVirt Engine, use async/await promise

***IN DEVELOPMENT***

## Usage

Require ovirt

    let ovirt = require('ovirt-engine-sdk-nodejs')

Connect to oVirt Engine API and do something fun

    // Connect
    await ovirt.connection(
      process.env.OVIRT,
      process.env.OVIRT_CACERT,
      process.env.OVIRT_USERNAME,
      process.env.OVIRT_PASSWORD
    )
    
    // Get hosts then vms
    let vms = await ovirt.vmsList()
    let hosts = await ovirt.hostsList()
    
    // or do it in parallel
    let info = await Promise.all([
      ovirt.vmsList(),
      ovirt.hostsList()
    ])
    
    // vms now in info[0]
    // hosts now in info[1]

See demo for more and full example

## Current API

    // Connection
    async ovirt.connection
     
    // Services
    async ovirt.vmsList
    async ovirt.hostsList
    
    // Support functions to write API call
    async ovirt.get
    async ovirt.post
    async ovirt.put
    async ovirt.delete
    
(c) 2017 by ViethanIT College - Le Nhat Anh
