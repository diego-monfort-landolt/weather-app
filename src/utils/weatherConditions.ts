export const getWeatherCondition = (code: number): string => {
  switch (code) {
    case 0:
      return 'Cielo despejado';
    case 1:
    case 2:
    case 3:
      return 'Parcialmente nublado';
    case 45:
    case 48:
      return 'Niebla';
    case 51:
    case 53:
    case 55:
      return 'Lluvia ligera';
    case 61:
    case 63:
    case 65:
      return 'Lluvia';
    case 71:
    case 73:
    case 75:
      return 'Nieve';
    case 80:
    case 81:
    case 82:
      return 'Lluvia fina';
    case 95:
      return 'Tormenta';
    default:
      return 'Estado desconocido';
  }
};
