# 策略模式 - 條條大路通羅馬，目的達到就好

## 定義

- 定義一系列的演算法，封裝後，可以隨意的交互替換。
- ex: 單一彈窗、redux store、表單校驗
- 策略模式通常包還策略類別（裝演算法或商業邏輯）跟環境類別（實作策略類別的部分）

---

### JS 中的策略模式

在傳統物件導向中，是基於類別，但 JS 是一門無類別的語言，
在 JS 中，策略模式常常是使用物件搭配函式，更直接簡單的實作。

```js
const strategies = {
  S: (salary) => salary * 4,
  A: (salary) => salary * 2,
  B: (salary) => salary * 1.5,
};
function calcBonusExampla(level, salary) {
  return strategies[level](salary);
}
```

---

### 表單校驗使用策略模式

假設有某個 `<Form>` dom，底下的 input 需要包含各種條件驗證。

策略物件：

```js
const strategies = {
  required: function (val, errMsg) {
    if (val === "") return errMsg;
  },
  minLength: function (val, length, errMsg) {
    if (val.length < length) return errMsg;
  },
  isMobile: function (val, errMsg) {
    if (!/(^1[3|5|8][0-9]{9}$)/.test(value)) return errMsg;
  },
};
```

預設使用者使用情境：

```js
const registerForm = document.getElementById("testForm");

const validateFunc = function () {
  const validator = new Validator();
  // 幫某input dom添加規則
  validator.add(registerForm.username, [
    {
      strategy: "required",
      errMsg: "名稱不得為空",
    },
    {
      strategy: "minLength:6",
      errMsg: "名稱長度不得低於6",
    },
  ]);

  validator.add(registerForm.phone, [
    {
      strategy: "required",
      errMsg: "手機不得為空",
    },
    {
      strategy: "isMobile",
      errMsg: "手機格式不正確",
    },
  ]);

  return validator.validate();
};

registerForm.onsubmit = function () {
  const errMsg = validateFunc();
  if (errMsg) {
    alert(errMsg);
    return false;
  }
  return true;
};
```

所以可以假設這個類別有一個`add`方法，接受 array，一個`validate`方法，執行驗證。
必須要有一個儲存 結合策略跟規則 的 array，最後 `validate` 一次執行，只要檢驗到有任一錯誤直接返回錯誤提示。

```js
const Validator = function () {
  this.funcArr = [];
};

Validator.prototype.add = function (dom, rules) {
  const argument = [dom.value];
  rules.forEach((rule) => {
    const [key, ruleLength] = rule.split(":");
    if (ruleLength) argument.push(ruleLength);
    argument.push(rule.errMsg);

    this.funcArr.push(function () {
      return strategies[key].apply(dom, argument);
    });
  });
};

Validator.prototype.validate = function () {
  for (let i = 0, validatorFunc; (validatorFunc = this.funcArr[i++]); ) {
    const errMsg = validatorFunc();
    if (errMsg) return errMsg;
  }
};
```

---

### 策略模式的優缺點

- 優點：

  - 避免過多的條件述句
  - 符合開放封閉原則，演算法的封裝加上易懂易擴展的特性
  - 複用性高

- 缺點：
  - 增加許多策略物件
  - 不符合最少知識原則，使用者需要先了解所有的 strategy
