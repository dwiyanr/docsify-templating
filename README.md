# docsify-templating

A thin Docsify plugin to support templating languages on Docsify markdown.
Heavily inspired by [docsify-mustache](https://github.com/docsify-mustache/docsify-mustache.github.io).


## Installation

Add the following script into docsify document:
```html
<script src="//unpkg.com/docsify-templating/dist/docsify-templating.min.js"></script>
```


## Usage

### Using handlebars
Docsify configuration:
```html
<!-- Need template engine to be added to the html, this example use Handlebars -->
<script src="//unpkg.com/handlebars/dist/handlebars.min.js"></script>
<script >
    window.$docsify = {
      // ...
      templating: {
        render: (content, data) => Handlebars.compile(content)(data),
        data: {
          from: "me",
          to: "World"
        }
      }
    };
</script>
```

Markdown File:
```md
Hello {{to}}!
Greetings from {{from}}.
```

Rendered Markdown:
```md
Hello World!
Greetings from me.
```

### Using function as data
Docsify configuration:
```js
window.$docsify = {
  // ...
  templating: {
    render: renderFun,
    data: {
      fetchFunction: async () =>
        JSON.parse(await Docsify.get("resource/data.json"))
    }
  }
};
```

Data file `resource/data.json`
```json
{
  "from": "me",
  "to": "world"
}
```

Markdown File:
```md
Hello {{fetchFunction.to}}!
Greetings from {{fetchFunction.from}}.
```

Rendered Markdown:
```md
Hello World!
Greetings from me.
```


## Options

Docsify template configuration options

### templating.data
```
object
```
The data to be used to render the template. By default, it is an empty object. The object can be a nested one. The first level of data can be a function that returns the value that wants to be used. This can be used to fetch the data from external sources or separate docsify resource.

### templating.render
```
function(markdown_template, data) => string
```
A render function that accepts docsify markdown content as the template and
the data that specified on `templating.data`.
