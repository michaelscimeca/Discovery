const Express = require('express');
const Prismic = require('prismic-javascript');
const PrismicDOM = require('prismic-dom');
const hbs = require('hbs');
const Cookies = require('cookies');
const PrismicConfig = require('./prismic-configuration');

const app = new Express();

app.set('view engine', 'hbs');
app.set('views', `${__dirname}/views`);

app.use(Express.static(`${__dirname}/static`));

// Middleware to inject prismic context
app.use((req, res, next) => {
  Prismic.api(PrismicConfig.apiEndpoint, {
    accessToken: PrismicConfig.accessToken,
    req
  }).then((api) => {
    req.prismic = { api };
    next();
  }).catch((error) => {
    next(error.message);
  });
});

app.get('/', (req, res, next) => {
  req.prismic.api.getSingle('home_page').then((document) => {
    if (document) {
      res.render('home', {
        // document,
        title: 'Hello...',
        description: 'Description',
        url: `${req.protocol}://${req.get('host')}${req.originalUrl}`,
        'og_img': '#',
        'site_name': 'Hello Starter',
        'author': 'Red Square'
      });
    } else {
      var err = new Error();
      err.status = 404;
      next(err);
    }
  });
});

app.get('/zoom', (req, res, next) => {
  req.prismic.api.getSingle('home_page').then((document) => {
    if (document) {
      res.render('zoom', {
        // document,
        title: 'Hello...',
        description: 'Description',
        url: `${req.protocol}://${req.get('host')}${req.originalUrl}`,
        'og_img': '#',
        'site_name': 'Hello Starter',
        'author': 'Red Square'
      });
    } else {
      var err = new Error();
      err.status = 404;
      next(err);
    }
  });
});

app.get('/mouse', (req, res, next) => {
  req.prismic.api.getSingle('home_page').then((document) => {
    if (document) {
      res.render('mouse', {
        // document,
        title: 'Hello...',
        description: 'Description',
        url: `${req.protocol}://${req.get('host')}${req.originalUrl}`,
        'og_img': '#',
        'site_name': 'Hello Starter',
        'author': 'Red Square'
      });
    } else {
      var err = new Error();
      err.status = 404;
      next(err);
    }
  });
});

app.get('/:uid', (req, res, next) => {
  req.prismic.api.getByUID('page', req.params.uid).then((document) => {
    if (document) {
      res.render('detail', {
        document,
        title: 'Hello...',
        description: 'Description',
        url: `${req.protocol}://${req.get('host')}${req.originalUrl}`,
        'og_img': '#',
        'site_name': 'Hello Starter',
        'author': 'Red Square'
      });
    } else {
      var err = new Error();
      err.status = 404;
      next(err);
    }
  });
});

app.get('/preview', (req, res) => {
  const { token } = req.query;
  if (token) {
    req.prismic.api.previewSession(token, PrismicConfig.linkResolver, '/').then((url) => {
      const cookies = new Cookies(req, res);
      cookies.set(Prismic.previewCookie, token, { maxAge: 30 * 60 * 1000, path: '/', httpOnly: false });
      res.redirect(302, url);
    }).catch((err) => {
      res.status(500).send(`Error 500 in preview: ${err.message}`);
    });
  } else {
    res.send(400, 'Missing token from querystring');
  }
});

app.get('*', function (req, res, next) {
  var err = new Error();
  err.status = 404;
  next(err);
});

app.use(function (err, req, res, next) {
  if (err.status !== 404) {
    return next();
  }

  res.render('four-oh-four', {
    title: 'Not found',
    description: 'Description',
    url: `${(req.get('x-forwarded-port') === '443' || req.get('x-forwarded-port') === 443) ? 'https' : 'http'}://${req.get('host')}${req.originalUrl}`,
    'og_img': '#',
    'site_name': 'Hello Starter',
    'author': 'Red Square'
  });
});

hbs.registerHelper('PrismicText', context => PrismicDOM.RichText.asHtml(context, PrismicConfig.linkResolver));

app.listen(process.env.PORT || 3000);
