function make(...args) {

    let currentSum = 0,
        arr_first = [].slice.call(args);

    function count(...args) {

        let arr_second = [].slice.call(args);

        if(typeof arr_second[0] === 'function'){
            arr_first.forEach(function (item) {
                currentSum += item;
            });
        }
        else {
            for (let i = 0; i < arr_second.length; i++)
                arr_first.push(arr_second[i]);
        }

        return count;
    }

    count.toString = function() {
        return currentSum;
    };

    return count;

}

function sum(a, b) {
    return a + b;
}
