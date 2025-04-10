function make (vl){
    return JSON.stringify(vl)
}

console.log(JSON.parse(make("mmm")))