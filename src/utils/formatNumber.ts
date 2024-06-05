export function formatNumber(value: string | number): string {
	// Convierte el número a una cadena de texto
	let str = value.toString();

	// Divide la cadena en dos partes: parte entera y parte decimal
	let parts = str.split(".");

	// Separa la parte entera en grupos de tres y agrega puntos entre ellos
	parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");

	// Si no hay parte decimal, agrega ",00"
	if (parts.length === 1) {
		parts.push("00");
	}

	// Si la parte decimal tiene menos de dos dígitos, agrega ceros a la derecha
	if (parts[1].length < 2) {
		parts[1] += "0";
	}

	// Reemplaza el separador decimal por una coma
	parts[1] = parts[1].replace(".", ",");

	// Une las partes entera y decimal con una coma entre ellas
	return parts.join(",");
}
