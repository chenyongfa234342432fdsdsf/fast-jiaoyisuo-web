import NP from 'number-precision';
/**
 * Replace number.toFixed with Math.round
 */
export function toFixed(number, precision) {
    var pow = Math.pow(10, precision);
    return (Math.round(number * pow) / pow).toFixed(precision);
}
/**
 * Convert number to non-scientific notation
 */
export function toSafeString(number) {
    // Use native Number.toString when it is NaN or non-scientific notation
    var nativeNumberStr = number.toString();
    if (Number.isNaN(+number) || !nativeNumberStr.includes('e')) {
        return nativeNumberStr;
    }
    try {
        var isNegative = number < 0;
        var absoluteValue = Math.abs(+number);
        // Get decimal length
        var digitLength_1 = NP.digitLength(absoluteValue);
        // Convert decimal to integer
        var integerNum = NP.float2Fixed(absoluteValue);
        // Convert integer to non-scientific notation string
        var integerStr_1 = integerNum
            .toString()
            .replace(/e\+(\d+)/i, function (_, $1) { return new Array(+$1).fill(0).join(''); });
        return "" + (isNegative ? '-' : '') + (digitLength_1 === 0
            ? integerStr_1
            : integerStr_1.replace(new RegExp("\\d{1," + digitLength_1 + "}$"), function (match) {
                var decimalStr = ("" + new Array(digitLength_1).fill(0).join('') + match).slice(-digitLength_1);
                return (integerStr_1.length <= digitLength_1 ? 0 : '') + "." + decimalStr;
            }));
    }
    catch (e) { }
    return nativeNumberStr;
}
