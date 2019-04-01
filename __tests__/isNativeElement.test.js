const { isPropOfNativeElement } = require('../src/can-migrate-script')

describe('isNativeElement', () => {
    it('should return true for input', () => {
        const string = 'some test text <input {value}="test"/>'
        const propPosition = 22
        expect(isPropOfNativeElement(string, propPosition)).toBe(true)
    });
});