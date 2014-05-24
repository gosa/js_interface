/* global describe, it */

(function () {
    'use strict';
    
    var TestInterface = function(classInstance) {
        var method, methods = {
            interfaceMethod: function() {throw new Error('Method not implemented')},
            commonMethod: function(){throw new Error('Method not implemented')}
        };
        var interfaceToReturn = methods;
        
        for (method in methods) {
            if (this && (!this[method] || ('function' !== typeof this[method]))) {
                this[method] = methods[method];
            }
            if (classInstance && classInstance[method] && ('function' === typeof classInstance[method])) {
                interfaceToReturn[method] = classInstance[method];
            }
        }
        
        
        return interfaceToReturn;
    };
    var TestClass = function() {
    };
    TestClass.prototype = {
        classMethod: function(){},
        commonMethod: function(){return 5}
    };
    TestInterface.call(TestClass.prototype);
    var testObject = new TestClass();

    describe('JS interface', function () {
        it('should not remove class methods that are not defined in interface itself', function () {
            expect(testObject).to.have.property('classMethod');
        });
        it('should add missing interface methods to a class', function () {
            expect(testObject).to.have.property('interfaceMethod');
        });
        it('should ensure only interface methods are available when used on concrete object', function () {
            var interfaceObject = TestInterface(testObject);
            expect(interfaceObject).to.have.property('interfaceMethod');
            expect(interfaceObject).to.not.have.property('classMethod');
        });
        it('should trow when intrface mehod is called on interface object and interface mehod is not defined in a class', function () {
            var interfaceObject = TestInterface(testObject);
            expect(interfaceObject.interfaceMethod).to.throw('Method not implemented');
        });
        it('should run class method on interface object if method is defined in class', function () {
            var interfaceObject = TestInterface(testObject);
            expect(interfaceObject.commonMethod).to.not.throw('Method not implemented');
            expect(interfaceObject.commonMethod()).to.equal(5);
        });
    });
})();
