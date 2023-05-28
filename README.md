# JavaScript 設計模式與開發實踐

書名: 『JavaScript 設計模式與開發實踐』
作者: 曾探

## Chapator 01 - 物件導向的 JS

### 動態類型語言和鴨子類型

JS 是一門動態語言，只有在執行後才會產生出類型不符等相關的錯誤。

沒有類型的限制的優點是，code 的數量可以較少，不用持續的定義類型，因此可以更著重在商業邏輯上。

動態語言，建立在`鴨子類型`的概念上。
只要他看起來像是鴨子、叫起來也是鴨子，管他是不是真的鴨子。
(不取決於類型，而是取決於他有沒有那個方法)

JS 也是屬於介面導向的語言。

---

### 多態

多態（ploymorphism）是什麼？
執行同一種方法，卻可以產出不同的執行結果。
同時把做什麼、怎麼做，分開寫。 -> 把不變的部分分離，變動的封裝起來。

在 JS 當中，多態是天生的，他並不用像是 Java 一樣，需要特別定義虛擬類別，再透過繼承來擴充。
會說是天生的是因為，他在執行時才會知道物件是指哪個特定的對象，他可以是任意一個。

多態最棒的好處就是不必再詢問物件是什麼類型，再去叫他執行特定的行為。
就像是導演只要喊 action，所有工作人員會做自己的任務。
不用再寫判斷句，叫他做什麼了。

```js
const A = function () {};
A.prototype.show = () => console.log("AAA");

const B = function () {};
B.prototype.show = () => console.log("BBB");

function makeShow(method) {
  if (method.show) method.show();
}

makeShow(new A());
makeShow(new B());
```

---

### 封裝

經過封裝後，使用者只需要知道它暴露的 api，不需要知道它實作的原理，目的是複用性。
在 JS 當中，變數的生存範圍即是函式內，沒有像是 Java，有不同的存取權限。
本來封裝對於靜態語言來說，是在封裝類型，建立在抽象類型或介面之後。

設計模式的精髓 `把不變的部分分離，變動的封裝起來`，所以封裝的目標對象就是變動的部分！

設計模式一書當中提到 23 種設計模式，且被劃分為三種 - 建立型、行為型、結構型。
建立型 - 是封裝建立物件的變化。
行為型 - 是封裝物件的行為變化。
結構型 - 是封裝物件和物件之間的變化。
最大程度的保證了系統的穩定性和可擴展性。

---

### 原型模式和基於原型繼承的 JavaScript 物件系統

1. 原型模式是什麼
   類別和物件就像是鑄模、鑄件。但在原型設計模式當中，類別不是必要的存在。
   原型模式，可以是設計模式，也可以是程式設計的規範。
2. 建立物件的手段
   是通過複製來製造物件(但目的是建立某類型的物件，複製只是手段)。在 ES5 當中就提供了`Object.create`的方法來複製物件。

   ```js
   const Plane = function (name) {
     this.name = name;
     this.blood = 500;
     this.attackLevel = 1;
     this.defenseLevel = 1;
   };
   const plane = new Plane("aaa");
   const clonePlane = Object.create(plane);
   ```

   ```js
   // Object.create polyfill
   Object.create = function (proto, propertiesObject) {
     if (
       !(
         proto !== null ||
         typeof proto !== "object" ||
         typeof proto !== "function"
       )
     ) {
       throw Error("一定要是物件或是null 才可以複製");
     }
     // Object.create(null) ->  建立以null為原型的物件

     const obj = new Object();
     obj.__proto__ = proto;
     if (typeof propertiesObject === "object") {
       Object.defineProperties(obj, propertiesObject);
     }
     return obj;
   };
   ```

3. 原型模式的規則
   1. 所有資料都是物件
   2. 通過複製來建立物件
   3. 他們都會記住自己的原型
   4. 如果物件無法回應某個請求，會把請求委託給他的原型
4. JS 中的原型繼承，如何符合規則

   1. 所有資料都是物件 - 幾乎所有東西都是物件，物件的根物件是`Object.prototype`，都是由它複製而來

      ```js
      const a = new Object();
      const b = {};
      console.log(Object.getPrototypeOf(a) === Object.prototype); // true
      console.log(Object.getPrototypeOf(b) === Object.prototype); // true
      ```

   2. 通過複製來建立物件 - 在 JS 當中，函式可以被當作普通的函式呼叫，但也可以被當作建構子。

      ```js
      function Person(name) {
        this.name = name;
      }
      Person.prototype.getName = function () {
        return this.name;
      };
      function mockNew() {
        // 第一個參數假設是複製的物件，第二個參數是物件的參數
        const obj = new Object();
        let constructor = Array.prototype.shift.call(arguments); // 取的第一個參數
        obj.__proto__ = constructor.prototype;
        const res = constructor.apply(obj, arguments);
        return typeof res === "object" ? res : obj; // 記住執行結果，如果建構子返回的不是物件則返回新對象
      }
      ```

   3. 物件會記住原型
      物件`__proto__`會指向複製的物件的 prototype，
   4. 如果物件無法回應某個請求，會把請求委託給他的原型
      會順著原型鏈往上找，另外 `Object.prototype` 的原型是 `null`。

---

> 所以 new 做了什麼？

1. 創建一個新對象
2. 將`__proto__`指向到父類的 prototype
3. 執行建構子，並記住執行的結果
4. 如果執行的結果是物件，則返回結果，不然就返回新創建的對象

---

## Chapator 02 - this、call、apply

在 JS 當中 this 總是指向某個物件，而具體指向哪個物件是在運行時執行環境動態綁定的（撇除掉箭頭函式）。

### this 的指向

所以在函式被呼叫時，會改變 this 的指向。
撇除掉 with, eval 的狀況，this 的指向會分為四種。

1. 作為某物件的方法呼叫
2. 普通函式呼叫
3. 建構子呼叫
4. apply, call 綁定

- 作為某物件的方法呼叫

  ```js
  const a = 2;
  const obj = {
    a: 1,
    fn: function () {
      return this.a;
    },
  };
  const result = obj.fn(); // 1
  ```

- 普通函式呼叫
  指向全域物件，在瀏覽器中指的是 window。在 ES5 strict 模式中，指向的是 undefined

  ```js
  window.a = 2;
  const obj = {
    a: 1,
    fn: function () {
      return this.a;
    },
  };
  const result = obj.fn;
  result(); // 2
  ```

  ```js
  window.id = "aaa";
  document.getElementById("div1").onclick = function () {
    console.log(this.id); // "div1"
    const callback = function () {
      return this.id;
    };
    callback(); // "aaa"
  };
  // 解決方案: 另外設立變數存this
  ```

- 建構子呼叫
  一般來說，this 會指向建構子回傳的物件。但如果回傳的型別不是物件，會回傳新建立的物件本身。

  ```js
  const Test = function(){
    this.name = "aaa";
    return {
        name: "bbb";
    }
  }
  const obj = new Test();
  obj.name; // "bbb"
  ```

  ```js
  const Test = function () {
    this.name = "aaa";
    return "bbb";
  };
  const obj = new Test();
  obj.name; // "aaa"
  ```

### 遺失的 this

```js
// 這會有什麼問題？
const getId = document.getElementById;
getId("div1");
// getId 會變成普通函式的呼叫
// getElementById 中如果有實作 this 則會從 document 改成指向 window

// 這樣才會指向 document
const getId = function (id) {
  return document.getElementById(id);
};
getId("div1");

// 或者重新的封裝 getElementById
document.getElementById = (function (fn) {
  return function () {
    return fn.apply(document, arguments);
  };
})(document.getElementById);
```

### call, apply

apply 接受兩個參數，
第一個為指定函式內 this 的指向（可為空值，則為預設的宿主物件，瀏覽器是 window，如果為嚴格模式，則是 null），
第二個參數為陣列或類陣列，因為不必關心有多少參數，使用頻率高。

call 只是 apply 構建的語法糖，只是傳入的參數是不固定的，通常用做需要一目瞭然知道形參跟實參的對應關係。

他們也用在需要借用某物件方法時。

```js
Math.max.apply(null, [1, 2, 4, 8, 3]);
```

比方說，類陣列是沒有辦法操作 Array.prototype 上的方法的，但可以拿來借用，做到像是繼承一般的功能。

v8 引擎實作的 push 原理是？

```js
function mockPush(){
    // this 指向的是調用的對象，不管 this 指的到底是誰，有 length 可以調用就好
    var n = TO_UNIT32(this.length);
    // push 的參數個數
    var m = %_ArgumentsLength();
    for(var i = 0; i < m; i++){
        this[i+n] = %_Arguments(i); // 開始複製<所以 push 算是複製的過程
    }
    this.length = n + m; // 新的長度
    return this.length;
}
```

上述可以知道，只要 this 有 length 方法可以調用，且可以存取屬性，則其實可以 apply 到其他物件身上。

```js
const a = {};
Array.prototype.push.call(a, "1");
concole.log(a.length); // 1
console.log(a[0]); // '1'
```

### bind

也是 apply 為基礎寫的語法糖。

```js
// 簡化版bind
function mockBind() {
  const thisFn = this; // 指向原函式
  const bindObj = [].shift.call(arguments); // bind內的第一個參數 欲綁定的物件
  const args = [].slice.call(arguments); // bind 第一個以後的參數，轉換成陣列
  return function () {
    return thisFn.apply(bindObj, [].concat(args, [].slice.call(arguments)));
  };
}

const obj = {
    name: "aaa";
}

const fn = function(a,b,c,d){
    console.log(this.name)
    console.log([a,b,c,d])
}.bind(obj, 1, 2);

fn(3, 4); // "aaa", [1,2,3,4]
```
