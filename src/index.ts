import express from 'express';
import path from 'path';
import flash from 'connect-flash';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import router from './routes';
import logger from 'morgan';
import { AppDataSource } from './config/ormconfig';
import i18next from 'i18next';
import i18nextMiddleware from 'i18next-http-middleware';
import i18nextBackend from 'i18next-fs-backend';
import { engine } from 'express-handlebars';
const app = express();
const port = process.env.PORT || 3000;

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

//i18next
i18next
  .use(i18nextBackend)
  .use(i18nextMiddleware.LanguageDetector)
  .init({
    fallbackLng: 'vi',
    preload: ['vi', 'en'],
    supportedLngs: ['vi', 'en'],
    saveMissing: true,
    backend: {
      loadPath: path.join(__dirname, 'locales/{{lng}}/{{ns}}.json'),
      addPath: path.join(__dirname, 'locales/{{lng}}/{{ns}}.missing.json'),
    },
    detection: {
      order: ['querystring', 'cookie'],
      caches: ['cookie'],
      lookupQuerystring: 'locale',
      lookupCookie: 'locale',
      ignoreCase: true,
      cookieSecure: false,
    },
  });
app.use(i18nextMiddleware.handle(i18next));

// Parse URL-encoded and JSON bodies
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(cookieParser('secretString'));

app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: 'morricoffee',
    cookie: { maxAge: 60000 },
  }),
);
app.use(flash());

app.set('views', path.join(__dirname, 'views'));
// Template engine
// app.engine('handlebars', exphbs());
app.engine('.hbs', engine({ extname: '.hbs' }));
app.set('view engine', '.hbs');

app.use(logger('dev'));

app.use(router);

AppDataSource.initialize()
  .then(() => {
    console.log('Database initialized');
  })
  .catch((error: Error) => console.log('Database connect failed: ', error));
// Start server
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
