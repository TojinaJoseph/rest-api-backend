import jwt from "jsonwebtoken";
// import config from "config";

// const privateKey = config.get<string>("privateKey");
// const publicKey = config.get<string>("publicKey");
// const publicKey = config.get<string>("publicKey").replace(/\\n/g, "\n");

export function signJwt(object: Object, options?: jwt.SignOptions | undefined) {
  return jwt.sign(object, process.env.JWT_SECRET || "your-secret-key", {
    ...(options && options),
    // algorithm: "RS256",
  });
}

export function verifyJwt(token: string) {
  try {
    // const decoded = jwt.verify(token, publicKey);
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key"
      // { algorithms: ["RS256"] }
    );

    return {
      valid: true,
      expired: false,
      decoded,
    };
  } catch (error: any) {
    return {
      valid: false,
      expired: error.message === "jwt expired",
      decoded: null,
    };
  }
}
