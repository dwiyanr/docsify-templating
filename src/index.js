const templating = function (hook, vm) {
    hook.init(function () {
        vm.templating = window.$docsify.templating || {};
        vm.templating.render = vm.templating.render || noopRender;
        vm.templating.parsedData = parse(vm.templating.data);
    });

    hook.beforeEach(function (content, next) {
        vm.templating.parsedData.then(
            (parsedData) => {
                let data = {};
                Object.assign(data, parsedData);
                if (vm.frontmatter) {
                    data.frontmatter = vm.frontmatter;
                }

                next(vm.templating.render(content, data));
            },
            (error) => { console.log(error); }
        );
    });

    function noopRender(template, data) {
        return template;
    }

    async function parse(data) {
        let entries = Object.entries(data || {})
            .map(async ([key, value]) =>
              [key, await parseValue(value)]
            );
        entries = await Promise.all(entries);
        return Object.fromEntries(entries);
    }

    async function parseValue(value) {
      if (typeof value == 'function') {
          return await value();
      } else {
          return value;
      }
    }
}

window.$docsify.plugins = [].concat(window.$docsify.plugins, templating);
