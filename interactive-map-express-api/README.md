# Interactive Holiday Park Map: REST API
This is the REST API application for the Interactive Holiday Park Map Project. The REST API drives both the Back Office and Embedded Map applications. It follows standard REST 
protocol. Some routes are protected using an authentication mechanism. The 
REST API provides developers with a page of auto-generated documentation.

This project provides the following functionality: 
1. Follows REST protocol by returning correct status codes.
2. Implements an authentication mechanism that can protect some routes with JWT 
tokens.
3. Provides documentation for developers at /docs.
4. Drives both web applications


## Project setup
Please see the list of NPM commands below to run the project.
### Installs dependencies
```
npm install
```

### Compiles and hot-reloads for development
```
npm run dev
```

### Compiles for production
```
npm run build
```

### Run unit tests
```
npm run test:unit
```

### Run integration tests
```
npm run test:integration
```