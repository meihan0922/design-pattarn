export default function () {
  // const Example = function (name) {
  //   this.name = name;
  //   this.instance = null;
  // };

  // Example.prototype.getName = function () {
  //   return this.name;
  // };

  // Example.getInstance = function (name) {
  //   if (!this.instance) {
  //     this.instance = new Example(name);
  //   }
  //   return this.instance;
  // };

  // const a = Example.getInstance("a");
  // const b = Example.getInstance("b");

  // console.log(a === b);

  const Example = function (name) {
    this.name = name;
  };

  Example.prototype.getName = function () {
    return this.name;
  };

  // 專門處理指向同一實例的類別
  const ProxyExample = {
    function() {
      let instance = null;
      return function (name) {
        if (!instance) {
          instance = new Example(name);
        }
        return instance;
      };
    },
  }();

  const a = new ProxyExample("a");
  const b = new ProxyExample("b");

  console.log(a === b);
}
