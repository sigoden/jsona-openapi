# JSONA-OPENAPI-JS

A parser to convert jsona format openapi file to cononcial json openapi file. 

```
npm i jsona-openapi-js
```


```js
const { parseOpenApi } = require("jsona-openapi-js");

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

const spec = parseOpenApi(text); // openapi spec object
```