//将data属性传进来
function Observer(data){
	this.data = data;
	this.walk(data);
}

Observer.prototype = {
	walk:function(data){                 //与()=>{}有区别
		let self = this;
		/*
		*
		*Object.keys() 方法会返回一个
		*由一个给定对象的自身可枚举属性组成的数组
		*
		 */
		Object.keys(data).forEach((key)=>{
			self.defineReactive(self.data, key, self.data[key])
		})
	},
	defineReactive:function(data, key, val){
		console.log("define");
		let dep = new Dep();

		let childObj = observe(val);
		let self = this

		Object.defineProperty(data, key, {
			enumerable: true, //可枚举
			configurable:false, //不能再define
			get:()=>{
                console.log("dep.target:")
                console.log(Dep.target)
				if(Dep.target){
					dep.depend()
				}
				return val
			},
			set:(newVal)=>{
				if(newVal == val){
					return;
				}else{
					val = newVal

					//新值是object的话，进行监听
					childObj = observe(newVal)
					//发布订阅通知
					dep.notify()
				}
			}
		})
	}
}
function observe(value){
	if(!value || typeof value !== 'object'){
		return;
	}

	return new Observer(value)
}

//消息发布的容器
let uid = 0
function Dep(){
	this.id = uid++
	this.subs = []    //这是订阅者
}
Dep.prototype = {
	addSub:function(sub){
		this.subs.push(sub)
	},
	removeSub:function(sub){
		let index = this.subs.indexOf(sub)
		if( index != -1) {
			this.subs.splice(sub, 1)
		}
	},
	depend: function () {
		Dep.target.addDep(this)
    },
	notify: function () {
		this.subs.forEach(function (sub) {
			sub.update()
        })
    }
}
Dep.target = null;

