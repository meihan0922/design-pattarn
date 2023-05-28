# 單例模式 - 從頭到尾只有一個實例

## 定義

- 保證一個類別只有一個實例，並且提供一個存取點。
- ex: 單一彈窗、redux store

---

### JS 中的單例模式

單例模式在傳統物件導向中，是基於類別，但 JS 是一門無類別的語言，
那為何不能使用全域變數就好？
因為會有命名空間污染的問題。要避開，可以封裝在物件內，或者寫個立即函式，封裝在範圍內，外暴特定的私有變數。

> 重點：建立物件和管理實例兩件事分開才能體現單例模式的威力。

---

### 硬是用實作單例

```js
const Example = function (name) {
  this.name = name;
  this.instance = null;
};

Example.prototype.getName = function () {
  return this.name;
};

Example.getInstance = function (name) {
  if (!this.instance) {
    this.instance = new Example(name);
  }
  return this.instance;
};

const a = Example.getInstance("a");
const b = Example.getInstance("b");

console.log(a === b);
```

> 但使用者需要知道這是單例，不能使用一般基本的`new XXX`，必須改用`getInstance`方法。

---

### 透明的單例模式

為了讓使用者用一般的`new`來創造實例，使用匿名函式，用閉包保留實例。

```js
const createDiv = (function () {
  let instance = null;

  const CreateDiv = function (html) {
    if (instance) {
      return instance;
    }
    this.html = html;
    this.init();
    return (instance = this);
  };

  CreateDiv.prototype.init = function () {
    const div = document.createElement("div");
    div.innerHTML = this.html;
    document.body.appendChild(div);
  };

  return CreateDiv;
})();

const a = new createDiv("a");
const b = new createDiv("b");

console.log(a === b);
```

> 但產生了什麼問題？
>
> - 這個 function 沒有遵守**單一職責原則**。做了建立實例跟初始化、保證只有一個實例。
> - 如果有一天，我們必須排除掉單例模式，改成建立各個實例，那怎辦？

---

### 代理實作單例模式

分離建立實例跟初始化、保證只有一個實例。
**類別是類別！單例是單例！**

```js
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
```

---

### 惰性單例

單例模式的重點！在合適的時候才建立物件，並且只建立唯一一個！
比方說，按鈕需要綁定事件，但多次的渲染只要綁定同一個事件就好。或是，彈窗只想要使用同一個，需要時再載入，但載入後，就不會再創造新的實例了。

```js
const getSingle = function(fn){
  let result;
  return function(){
    return result || result = fn.apply(this, arguments);
  }
};

const createLoginModal = function(){
  const div = document.createElement("div");
  div.innerHTML = '登入彈窗';
  div.style.display = 'none';
  document.body.appendChild(div);
  return div;
}
const createSingleLoginModal = getSingle(createLoginModal)

const createExampleModal = function(){
  const iframe = document.createElement("iframe");
  iframe.innerHTML = '另一個彈窗iframe';
  iframe.style.display = 'none';
  document.body.appendChild(iframe);
  return iframe;
}

const createSingleExampleModal = getSingle(createExampleModal)

document.getElementById('abc').onclick = function(){
  // 也可以createExampleModal
  const ele = createSingleLoginModal();
  ele.style.display = 'block';
}
```
