export function replaceMultipleStrings(inputString: string, replacements: [string, string][]): string {
	let result = inputString;
	
	for (const [searchValue, replaceValue] of replacements) {
		result = result.replace(new RegExp(searchValue, "g"), replaceValue);
	}

	return result;
}