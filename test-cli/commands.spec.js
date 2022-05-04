const funcs = require("../cli/errorfunctions");
//let exec = require("child_process").exec;
//exec and jest need to be installed

//Can be used to directly test CLI commands
function cli(args, cwd) {
  return new Promise((resolve) => {
    const str = `se2105 ${args.join(" ")}`;
    console.log(str);
    exec(str, { cwd }, (error, stdout, stderr) => {
      resolve({
        code: error && error.code ? error.code : 0,
        error,
        stdout,
        stderr,
      });
    });
  });
}

test("Station is not optional (4 cases)", () => {
  expect(funcs.validateStation({})).toBe(1);
  expect(funcs.validateStation({station: ""})).toBe(1);
  expect(funcs.validateStation({station: "AO00"})).toBe(0);
  expect(funcs.validateStation({datefrom: "20190101", dateto: "20200101"})).toBe(1);
});

test("Operators are not optional (8 cases)", () => {
  expect(funcs.validateOperators({})).toBe(1);
  expect(funcs.validateOperators({op1: ""})).toBe(1);
  expect(funcs.validateOperators({op1: "AO"})).toBe(1);
  expect(funcs.validateOperators({op2: ""})).toBe(1);
  expect(funcs.validateOperators({op2: "EG"})).toBe(1);
  expect(funcs.validateOperators({op1: "AO", op2: ""})).toBe(1);
  expect(funcs.validateOperators({op1: "AO", op2: "EG"})).toBe(0);
  expect(funcs.validateOperators({datefrom: "20190101", dateto: "20200601"})).toBe(1);
});

test("Operator is not optional (4 cases)", () => {
  expect(funcs.validateOperator({})).toBe(1);
  expect(funcs.validateOperator({op1: ""})).toBe(1);
  expect(funcs.validateOperator({op1: "AO"})).toBe(0);
  expect(funcs.validateOperator({datefrom: "20190101"})).toBe(1);
});

test("Format is not optional/must be json or csv (6 cases)", () => {
  expect(funcs.validateFormat({})).toBe(1);
  expect(funcs.validateFormat({format: ""})).toBe(1);
  expect(funcs.validateFormat({format: "txt"})).toBe(1);
  expect(funcs.validateFormat({format: 3})).toBe(1);
  expect(funcs.validateFormat({format: "json"})).toBe(0);
  expect(funcs.validateFormat({format: "csv"})).toBe(0);
});

test("Date is optional but gets filled when missing (8 cases)", () => {
  expect(funcs.valiDate({op2: "AO"})).toBe(2);
  expect(funcs.valiDate({op2: "EG"})).toBe(2);
  expect(funcs.valiDate({op1: "AO", op2: "EG"})).toBe(2);
  expect(funcs.valiDate({datefrom: "20190101"})).toBe(1);
  expect(funcs.valiDate({dateto: "20190101"})).toBe(1);
  expect(funcs.valiDate({datefrom: ""})).toBe(2);
  expect(funcs.valiDate({datefrom: "", dateto: ""})).toBe(2);
  expect(funcs.valiDate({datefrom: "20190101", dateto: "20200601"})).toBe(0);
});

test("Source is not optional in passesupdate", () => {
  expect(funcs.validatePassesUpdate({})).toBe(1);
  expect(funcs.validatePassesUpdate({source: ""})).toBe(1);
});