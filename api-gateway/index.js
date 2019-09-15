const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express()
const port = 7001

app.use(express.json());
app.use(express.urlencoded({
  extended: true,
}));

const serviceHosts = [
  {
    'serviceName': 'host-service',
    'url': 'http://localhost:5000'
  },
  {
    'serviceName': 'cook-service',
    'url': 'http://localhost:5000'
  },
];

const commonUrls = [
  {
    'method': 'get',
    'url': '/host-service/listofcooks',
  },
];

const getMappingUrl = (requestPath) => {
  const requestPathSplitted = requestPath.split('/');
  let requestPathSlittedSecondItem = requestPathSplitted.length && requestPathSplitted.length > 1 ? requestPathSplitted[1] : null;

  if (requestPathSlittedSecondItem) {
    requestPathSlittedSecondItem = requestPathSlittedSecondItem.toLowerCase();
    const filteredServiceHosts = serviceHosts.filter(service => service.serviceName === requestPathSlittedSecondItem);
    if (filteredServiceHosts.length) {
      return filteredServiceHosts[0].url;
    }
  }
  return null;
};

const isCommonUrl = (requestPath, requestMethod) => {
  if (!requestPath) {
    return false;
  }

  requestPath = requestPath.toLowerCase();
  const filteredUrls = commonUrls.filter(item => (requestPath.indexOf(item.url) > -1 && requestMethod.toLowerCase() === item.method));
  if (filteredUrls.length) {
    return true;
  }
  return false;
};

const accessAxios = async(req, res, config) => {
  const apiAxios = await axios(config);
  if (apiAxios) {
    if (apiAxios.status === 200) {
      res.status(apiAxios.status)
        .send(apiAxios.data);
    }
  }
}

router.use(async (req, res, next) => {
  console.log('%s %s %s - ', req.method, req.url, req.path, JSON.stringify(req.body, null, 2), req.header('content-type'));
  const mappingUrl = getMappingUrl(req.path);

  const isValidApi = isCommonUrl(req.path, req.method);
  if (isValidApi && req.url &&  mappingUrl) {
    next();
  } else {
    res.status(500).send({
      success: "false",
      message: "Invalid service access",
    });
  }
});

router.get('*', async (req, res) => {
  try {
    const mappingUrl = getMappingUrl(req.path);
    const config = {
      method: 'get',
      url: `${mappingUrl}${req.url}`,
      headers: { 'content-type': req.header('content-type') },
    };
    await accessAxios(req, res, config);
  } catch (error) {
    res.status(500).send({
      success: "false",
      message: "Failed to access api end point",
    });
  }
});

router.post('*', async (req, res) => {
  try {
    const mappingUrl = getMappingUrl(req.path);
    const config = {
      method: 'post',
      url: `${mappingUrl}${req.url}`,
      data: req.data,
      headers: { 'content-type': req.header('content-type') },
    };
    await accessAxios(req, res, config);
  } catch (error) {
    res.status(500).send({
      success: "false",
      message: "Failed to access api end point",
    });
  }
});

router.put('*', async (req, res) => {
  try {
    const mappingUrl = getMappingUrl(req.path);
    const config = {
      method: 'post',
      url: `${mappingUrl}${req.url}`,
      data: req.data,
      headers: { 'content-type': req.header('content-type') },
    };
    await accessAxios(req, res, config);
  } catch (error) {
    res.status(500).send({
      success: "false",
      message: "Failed to access api end point",
    });
  }
});

router.delete('*', async (req, res) => {
  try {
    const mappingUrl = getMappingUrl(req.path);
    const config = {
      method: 'post',
      url: `${mappingUrl}${req.url}`,
      headers: { 'content-type': req.header('content-type') },
    };
    await accessAxios(req, res, config);
  } catch (error) {
    res.status(500).send({
      success: "false",
      message: "Failed to access api end point",
    });
  }
});

app.use('/', router);

app.listen(port, () => console.log(`App listening on port ${port}!`))