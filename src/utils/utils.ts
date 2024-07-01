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
  ].join('')
);

