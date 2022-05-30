odatnurd-twitch-integrations
============================

This application provides some integrations with Twitch (e.g. dynamic overlays)
contained within a simple Node.JS app using [Express 4](http://expressjs.com/)
that is intended to be deployed via [Heroku](https://heroku.com).

## Running Locally

Make sure you have [Node.js](http://nodejs.org/) and the
[Heroku CLI](https://cli.heroku.com/) installed.

```sh
$ git clone git@github.com:OdatNurd/odatnurd-twitch-integrations.git # or clone your own fork
$ cd odatnurd-twitch-integrations
$ yarn install
$ yarn start
```

Your app should now be running on [localhost:5000](http://localhost:5000/).

## Deploying to Heroku

```
$ heroku create
$ git push heroku main
$ heroku open
```
or

[![Deploy to Heroku](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)
