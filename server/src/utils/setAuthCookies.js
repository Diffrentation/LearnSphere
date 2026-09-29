export const setAuthCookies = (res, accessToken, refreshToken) => {
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    // Browsers require Secure when SameSite=None. Use a same-site cookie for
    // local HTTP development and the cross-site setting only in production.
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };
  res.cookie("accessToken", accessToken, cookieOptions);
  res.cookie("refreshToken", refreshToken, cookieOptions);
};
