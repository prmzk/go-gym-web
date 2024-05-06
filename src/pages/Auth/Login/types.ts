export type LogInParams = {
  email: string;
};

export type LogInResponse = null;

export type LogInCallbackTokenResponse = {
  accessToken: string;
  refreshToken: string;
};
