
const otpStore = new Map<string, string>();

export function saveOTP(email: string, otp: string) {
  otpStore.set(email, otp);
}

export function verifyOTP(email: string, otp: string) {
  return otpStore.get(email) === otp;
}

export function deleteOTP(email: string) {
  otpStore.delete(email);
}
