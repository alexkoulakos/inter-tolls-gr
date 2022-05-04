module.exports.helpProcess = function() {
    const execSync = require('child_process').execSync;
    const output = execSync('se2105 --help', { encoding: 'utf-8' });
    console.log(output);
    console.log('\nFor more info on specific command, type "se2105 [command name] --help"');
}

module.exports.validateStation = function(options) {
    if(!options.station) {
        console.log("Wrong command Syntax. station option missing.")
        this.helpProcess()
        return 1;
    }
    return 0;
}

module.exports.validateOperators = function(options) {
    if(!options.op1) {
        console.log("Wrong command Syntax. op1 option missing.")
        this.helpProcess()
        return 1;
    }
    if(!options.op2) {
        console.log("Wrong command Syntax. op2 option missing.")
        this.helpProcess()
        return 1;
    }
    return 0;
}

module.exports.validateOperator = function(options) {
    if(!options.op1) {
        console.log("Wrong command Syntax. op1 option missing.")
        this.helpProcess()
        return 1;
    }
    return 0;
}

module.exports.validateFormat = function(options) {
    if(!options.format) {
        console.log("Wrong command Syntax. format option missing.")
        this.helpProcess()
        return 1;
    }
    if(options.format != 'csv' && options.format != 'json') {
        console.log("Wrong command Syntax. format option must be 'json' or 'csv'.")
        return 1;
    }
    return 0;
}

module.exports.valiDate = function(options) {
    var ch = 0;
    if(!options.datefrom) {
        console.log("datefrom option missing. Set to default value.")
        options.datefrom = '19700101'
        ch++;
    }
    if(!options.dateto) {
        console.log("dateto option missing. Set to current date.")
        var date = new Date()
        date.setDate(date.getDate()+1)
        options.dateto = date.toJSON().slice(0,10).replace(/-/g,'')
        ch++; 
    }
    return ch; 
}

module.exports.validatePassesUpdate = function(options) {
    if (!options.passesupd) {
        console.log("Wrong command syntax. passesupd option missing.")
        this.helpProcess()
        return 1;
    }
    if (!options.source) {
        console.log("Wrong command syntax. source option is missing.")
        this.helpProcess()
        return 1;
    }
    return 0;
}
