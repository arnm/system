import * as util from 'util';
const si = require('systeminformation');
const nwifi = require('node-wifi');
nwifi.init();

const getCurrentWifiConnections = util.promisify(nwifi.getCurrentConnections);

async function wifi() {
    return await getCurrentWifiConnections();
}

async function battery() {
    return await si.battery();
}

async function system() {
    const bat = await battery();
    const wif = await wifi();
    return { wifi: wif, battery: bat };
}

export default {
    Query: {
        system
    }
}
