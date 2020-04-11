const templating = function (hook, vm) {
    hook.init(function (content, next) {
        vm.templating = window.$docsify.templating || {};
        vm.templating.render = vm.templating.render || noop_render;

        parse(vm.templating.data).then(
            (parsed_data) => {
                vm.templating.parsed_data = parsed_data;
                next();
            },
            (error) => { console.log(error); }
        );
    });

    hook.beforeEach(function (content, next) {
        let data = {};

        Object.assign(data, vm.templating.parsed_data);
        if (vm.frontmatter) {
            data.frontmatter = vm.frontmatter;
        }

        next(vm.templating.render(content, data));
    });

    function noop_render(template, data) {
        return template;
    }

    async function parse(data) {
        let entries = Object.entries(data || {})
            .map(async ([key, value]) =>
              [key, await parse_value(value)]
            );
        entries = await Promise.all(entries);
        return Object.fromEntries(entries);
    }

    async function parse_value(value) {
      if (typeof value == 'function') {
          return await value();
      } else {
          return value;
      }
    }
}

window.$docsify.plugins = [].concat(window.$docsify.plugins, templating);
