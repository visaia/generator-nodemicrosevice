const fetch = require('isomorphic-fetch');

const SIDECAR = {
    uri: 'http://<%= sidecar %>:<%= sidecarProt %>'
}

const CONFIG_SERVER = 'core-config';

exports.getConfigServerInfo = () => fetch(`${SIDECAR.uri}/hosts/${CONFIG_SERVER}`).then((resp)=>resp.json());

exports.getConfig = (configName) => fetch(`${SIDECAR.uri}/${CONFIG_SERVER}/${configName}.json`).then((resp)=>resp.json());

