
# JWT Auth API with MongoDB

A Node.js JWT Auth API using MongoDB and Express. With some sprucing up and all in Typescript!


## Acknowledgements

 - Jason Watmore's [Node.js + MongoDB API - JWT Authentication with Refresh Tokens](https://jasonwatmore.com/post/2020/06/17/nodejs-mongodb-api-jwt-authentication-with-refresh-tokens) Tutorial
 - [Node Express Boilerplate](https://github.com/hagopj13/node-express-boilerplate)

## License

[MIT](./LICENSE)


## API Reference

Can be fond in [swagger.yaml](./swagger.yaml)
## Installation

Install with yarn (or npm)

```bash
cd node-mongo-jwt-auth-app
yarn
```

## Running

### Development

Utilizes [`ts-node`](https://www.npmjs.com/package/ts-node) and [`nodemon`](https://www.npmjs.com/package/nodemon) to watch the `./src` directory and re-run on file changes

```bash
yarn dev
```

### Production

```bash
yarn prod
```

(This will `clean` the `/dist/` folder, `build` the typescript files, and finally `start` the server in production mode)