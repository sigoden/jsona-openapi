# JSON-OPENAPI-JS

A parser to convert jsona format openapi file to cononcial json openapi file. 

```
npm i json-openapi-js
```


```js
const { parse } = require("json-openapi-js");

const text = `
{ @openapi
  createUser: { @endpoint({summary: "create a user"})
    route: "POST /users",
    req: {
      body: {
        firstName: "foo",
        lastName: "bar",
      }
    },
    res: {
      200: {
        firstName: "foo",
        lastName: "bar",
        role: "user",
      }
    }
  }
}
`;

parse(text); // openapi spec object
```