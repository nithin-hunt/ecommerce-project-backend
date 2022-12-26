const validateName = (name) => {
    const nameRegex = new RegExp(/[a-zA-Z][a-zA-Z]+[a-zA-Z]$/)
    return nameRegex.test(name);
  }
  
  const validateEmail = (email) => {
    const reg = new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/);
    return reg.test(email);
  }
  
  const validatePassword = (password) => {
    const passwordRegex = new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$");
    return passwordRegex.test(password); 
  }
  
  module.exports = {
    validateName,
    validateEmail,
    validatePassword
  }