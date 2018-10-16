function sumOfOther(arr){
    let rez = [];
    arr.forEach(function(item, index) {
        let sum = 0;
        arr.forEach(function (item_run, index_run) {
            if(index_run != index){
                if (Number(item_run))
                    sum += item_run;
            }
        });
        rez.push(sum);
    });
    return rez;
}

