'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../../../index");
const { networkInterfaces } = require('os');
class GetIpAddressUtil {
}
GetIpAddressUtil.getPrivateIpAndPort = () => {
    const nets = networkInterfaces();
    const results = Object.create(null);
    for (const name of Object.keys(nets)) {
        for (const net of nets[name]) {
            if (net.family === 'IPv4' && !net.internal) {
                if (!results[name]) {
                    results[name] = [];
                }
                results[name].push(net.address);
            }
        }
    }
    return `${results.en0[0]}:${index_1.PORT}`;
};
exports.default = GetIpAddressUtil;
