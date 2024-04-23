export const generateOTP = (length: number = 6) => {
  const factor = Math.pow(10, length - 1);
  return Math.floor(factor + Math.random() * 9 * factor);
};

export const verifyOTP = (otp: number, input: number) => {
  return otp === input;
};
