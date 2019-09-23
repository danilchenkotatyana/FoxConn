const Model = {
    DEV: 'dev',
    PROD: 'prod',
    STAGE: 'stage'
};

let model = Model.DEV;

const config_dev = {

    steal_path: '/node', //'/standalone3', // do not delete just leave empty
    ws_name: '/client', //'ws://localhost:5000/client',

    app_redirect_host: 'localhost',

    // prod or dev
    type: 'dev',
    php_host: '',

    languagesResource: '/google.csv'
};

const config_stage = {

    steal_path: '/node', //'/standalone3', // do not delete just leave empty
    ws_name: '/client', //'ws://localhost:5000/client',

    app_redirect_host: 'stageinfocusconx.infocus.net',

    // prod or dev
    type: 'stage',
    php_host: '',

    languagesResource: '/google.csv'
};

const config_prod = {

    steal_path: '/node', // do not delete just leave empty
    ws_name: '/client',

    app_redirect_host: 'dev.conx.com',

    // prod or dev
    type: 'prod',
    php_host: '',

    languagesResource: '/google.csv'
};

let config = model === Model.DEV ? config_dev : (model === Model.STAGE ? config_stage : config_prod);
config.getHost = function () {
    return this.php_host || '';
};

export default config;