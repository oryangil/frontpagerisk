export const apiBaseUrl = `${process.env.NEXT_PUBLIC_API_SERVER}/api/v1`;

// auth
export const signinUrl = `${apiBaseUrl}/auth/signin`;

// notifications
export const notiUrl = `${apiBaseUrl}/notifications`;

// transactions
export const transactionsUrl = `${apiBaseUrl}/transactions`;
export const transactionDetailUrl = `${apiBaseUrl}/transactions`;

// products
export const productsUrl = `${apiBaseUrl}/products`;
export const productDetailUrl = `${apiBaseUrl}/products`;

// integrations
export const webhooksUrl = `${apiBaseUrl}/webhooks`;

// finance
export const payoutsUrl = `${apiBaseUrl}/payouts`;
export const payoutDetailUrl = `${apiBaseUrl}/payouts`;
export const payoutAccountsUrl = `${apiBaseUrl}/payouts/accounts`;

// settings
export const tfaStatusUrl = `${apiBaseUrl}/settings/tfa/status`;
export const profileUrl = `${apiBaseUrl}/settings/profile`;
export const profileOTPUrl = `${apiBaseUrl}/settings/profile/otp`;
export const passwordChangeUrl = `${apiBaseUrl}/settings/profile/changepassword`;
export const emailChangeUrl = `${apiBaseUrl}/settings/profile/changemail`;
export const mailOTPUrl = `${apiBaseUrl}/settings/profile/otpmail`;
export const authenticatorCodeUrl = `${apiBaseUrl}/settings/auth/app/code`;
export const authenticatorVerifyUrl = `${apiBaseUrl}/settings/auth/app/verify`;
