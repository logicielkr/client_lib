GrahaFormula.Func.udf.date = function(data) {
	return DateParser.parse(GrahaFormula.Func.udf.string(data));
};
