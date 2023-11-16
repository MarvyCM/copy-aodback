const express = require('express');
const router = express.Router();
const http = require('http');
const constants = require('../../util/constants');
const proxy = require('../../conf/proxy-conf');
const utils = require('../../util/utils');
//LOG SETTINGS
const logConfig = require('../../conf/log-conf');
const loggerSettings = logConfig.getLogSettings();
const logger = require('js-logging').dailyFile([loggerSettings]);

/** GET ALL ORGANIZATIONS */
router.get(constants.API_URL_ORGANIZATIONS, function (req, res, next) {
    try {
        logger.debug('Servicio: Listado de organizaciones');
        let serviceBaseUrl = constants.CKAN_API_BASE_URL;
        let serviceName = constants.ORGANIZATIONS_LIST;
        let serviceParams = '?all_fields=true';
        let serviceRequestUrl = serviceBaseUrl + serviceName + serviceParams;
        logger.notice('URL de petición: ' + serviceRequestUrl);

        //Proxy checking
        let httpConf = null;
        if (constants.REQUESTS_NEED_PROXY == true) {
            logger.warning('Realizando petición a través de proxy');
            let httpProxyConf = proxy.getproxyOptions(serviceRequestUrl);
            httpConf = httpProxyConf;
        } else {
            httpConf = serviceRequestUrl;
        }

        http.get(httpConf, function (results) {
            var body = '';
            results.on('data', function (chunk) {
                body += chunk;
            });
            results.on('end', function () {
                res.json(body);
            });
        }).on('error', function (err) {
            utils.errorHandler(err, res, serviceName);
        });
    } catch (error) {
        logger.error('Error in route' + constants.API_URL_ORGANIZATIONS);
    }
});

/** GET ORGANIZATION DETAIL */
router.get(constants.API_URL_ORGANIZATIONS + '/:organizationName', function (req, res, next) {
    try {
        logger.debug('Servicio: Listado de organizaciones');
        let serviceBaseUrl = constants.CKAN_API_BASE_URL;
        let serviceName = constants.ORGANIZATION_DETAIL;
        let serviceParams = '?id=' + req.params.organizationName;
        let serviceRequestUrl = serviceBaseUrl + serviceName + serviceParams;
        logger.notice('URL completa: ' + serviceRequestUrl);

        //Proxy checking
        let httpConf = null;
        if (constants.REQUESTS_NEED_PROXY == true) {
            logger.warning('Realizando petición a través de proxy');
            let httpProxyConf = proxy.getproxyOptions(serviceRequestUrl);
            httpConf = httpProxyConf;
        } else {
            httpConf = serviceRequestUrl;
        }

        http.get(httpConf, function (results) {
            var body = '';
            results.on('data', function (chunk) {
                body += chunk;
            });
            results.on('end', function () {
                res.json(body);
            });
        }).on('error', function (err) {
            utils.errorHandler(err, res, serviceName);
        });
    } catch (error) {
        logger.error('Error in route' + constants.API_URL_ORGANIZATIONS);
    }
});

module.exports = router;