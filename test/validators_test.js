const {
    validateName,
    validateEmail,
    validatePassword,
  } = require("../utils/validators");
  
  var expect = require("chai").expect;
  
  describe("Testing Validators", function () {
    it("should return true for valid name", function () {
      expect(validateName("Nithin")).to.equal(true);
    });
    it("should return false for invalid name", function () {
      expect(validateName("Nithin01")).to.equal(false);
    });
    it("should return true for valid email", function () {
      expect(validateEmail("nithin@gmail.com")).to.equal(true);
    });
    it("should return false for invalid email", function () {
      expect(validateEmail("nithin.gmail.com")).to.equal(false);
    });
    it("should return true for valid password", function () {
      expect(validatePassword("HelloWorld@6")).to.equal(true);
    });
    it("should return false for invalid password", function () {
      expect(validatePassword("HelloWorld6")).to.equal(false);
    });
  });