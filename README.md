# fetchay
Lite HTTP request module wrapper for fetch API

## Installation
```
npm i fetchay
```

## Methods
GET: 
```js
get(url, args)
```

POST:
```js
post(url, args)
```

PATCH:
```js
patch(url, args)
```

PUT:
```js
put(url, args)
```

DELETE:
```js
delete_(url, args)
```

### Argument formats
**url**
- string or object
```js
{
  url: <string>,
  query: <object>,
  hash: <string>,
}
```

**args**
- undefined or object
```js
{
  body: <object>,
  headers: <object>,
}
```

### Response
```js
{
  status: <number>,
  data: <object>|<string>, // string if not valid json
  ok: <boolean>, // false if 400+ status, also throws error
  statusText: <string>,
  url: <string>,
  headers: <Response.headers>
}
```


## Usage
```js
import {get, post} from 'fetchay'
```

### accesing direct url
```js
get("api/test").then(resp => {
    console.log(resp);
}).catch(er => {
    console.log(er);
})
```

### url with dynamic query
```js
get({ 
    url: "/api/test",
    query: { status: 'active' } 
}).then(resp => {
    console.log(resp)
}).catch(er => {
    console.log(er)
})
```

### adding payload and changing header
```js
post("/api/test", { 
    body: { test: 123 },
    headers: { 'Authorization': 'Token' } 
}).then(resp => {
    console.log(resp)
}).catch(er => {
    console.log(er);
})
```
