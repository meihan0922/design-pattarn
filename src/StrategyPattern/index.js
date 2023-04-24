export default function () {
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
}
