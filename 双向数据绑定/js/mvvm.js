function MVVM(options) {
    this.$options = options|| {};
    let data = this._data = this.$options.data;
    let self = this

    // 数据代理
    // 实现 vm.xxx -> vm._data.xxx
    Object.keys(data).forEach(function (key) {

        //为每个变量配置set、get方法
        self._proxyData(key);
        console.log(key)
    })

    //初始化计算属性
    this._initComputed();

    //只观察data属性
    observe(data);

    //上面执行完 Dep.target == null

    //解构el
    //在这里面new Watcher将Dep.target改变，再执行一次data的get方法
    // 此时get里面的增加addSub
    //同时在compile里面有监听input，当数值改变时将新的数值执行set方法后，
    //执行notify里面的update里面的run更新视图
    this.$compile = new Compile(options.el || document.body, this)

}
MVVM.prototype = {
    $watch: function (key, cb, options) {
      new Watcher(this, key, cb);
    },
    _proxyData: function (key, setter, getter) {
        let self = this;
        setter = setter|| Object.defineProperty(self, key, {
            configurable: false,
            enumerable: true,
            get: function proxyGetter() {
                return self._data[key];
            },
            set: function proxySetter(newVal) {
                self._data[key] = newVal;
            }
        })
    },
    _initComputed: function () {
        let self = this;
        let computed = this.$options.computed;

        console.log("computed:")
        console.log(computed)

        if(typeof computed === 'object'){
            Object.keys(computed).forEach(function (key) {
                Object.defineProperty(self, key, {
                    get: typeof computed[key] === 'function'
                        ? computed[key]:computed[key].get,
                })

            })
        }
    }
}