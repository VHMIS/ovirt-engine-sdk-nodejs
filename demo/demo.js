let ovirt = require('../lib/ovirt')

async function demo () {
  // await connection
  await ovirt.connection(
    process.env.OVIRT,
    process.env.OVIRT_CACERT,
    process.env.OVIRT_USERNAME,
    process.env.OVIRT_PASSWORD
  )

  // get hosts and vms info, sync
  console.time('sync')
  let vms = await ovirt.vmsList()
  let hosts = await ovirt.hostsList()

  for (let vm of vms) {
    console.log(vm.$.id + ': ' + vm.name[0])
  }
  console.log('---')
  for (let host of hosts) {
    console.log(host.$.id + ': ' + host.name[0])
  }

  console.timeEnd('sync')

  console.log('========================================')

  // get hosts and vms info, parallel
  console.time('async')
  let info = await Promise.all([
    ovirt.vmsList(),
    ovirt.hostsList()
  ])

  for (let vm of info[0]) {
    console.log(vm.$.id + ': ' + vm.name[0])
  }
  console.log('---')
  for (let host of info[1]) {
    console.log(host.$.id + ': ' + host.name[0])
  }

  console.timeEnd('async')
}

// Run demo, don't forget catch all error
demo().catch(e => { console.log(e) })
