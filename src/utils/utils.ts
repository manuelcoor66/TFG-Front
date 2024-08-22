export const emailRegex = new RegExp(
  '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
);

export const passwordRegex = new RegExp(
  [
    '^',
    '(?=.*[a-z])',
    '(?=.*[A-Z])',
    '(?=.*\\d)',
    '(?=.*[!@#$%^&*()_+\\-=[\\]{};:\'",.<>/?`~|])',
    '[A-Za-z\\d!@#$%^&*()_+\\-=[\\]{};:\'",.<>/?`~|]{8,}',
    '$',
  ].join(''),
);

export const dniRegex = new RegExp(['^', '[0-9]{8}', '[A-Za-z]', '$'].join(''));

export const creditCardRegex = new RegExp(
  [
    '^', // Inicio del string
    '(?:\\d{4}-?){3}', // Tres grupos de 4 dígitos separados o no por un guión
    '\\d{4}', // Un último grupo de 4 dígitos
    '$', // Fin del string
  ].join(''),
);

export const expirationDateRegex = new RegExp(
  ['^', '(0[1-9]|1[0-2])', '\\/', '(\\d{2})$'].join(''),
);

export const cvcRegex = new RegExp(
  [
    '^', // Inicio del string
    '\\d{3,4}', // 3 o 4 dígitos numéricos
    '$', // Fin del string
  ].join(''),
);
