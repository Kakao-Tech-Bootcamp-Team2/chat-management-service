const jwt = require("jsonwebtoken");
const config = require("../config");
const { createLogger } = require("../utils/logger");
const { AuthorizationError } = require("../utils/errors");

const logger = createLogger("AuthMiddleware");

const auth = async (req, res, next) => {
  try {
    logger.debug(`Request Headers: ${JSON.stringify(req.headers)}`);
    const token = req.header("x-auth-token");
    const sessionId = req.header("x-session-id");

    logger.debug("Received headers:", {
      token: token ? "exists" : "missing",
      sessionId: sessionId ? "exists" : "missing",
    });

    if (!token || !sessionId) {
      throw new AuthorizationError("인증 토큰과 세션 ID가 필요합니다.");
    }

    try {
      logger.debug(`x-auth-token: ${token}`);
      logger.debug(`config.jwt.secret:${config.jwt.secret}`);
      const decoded = jwt.verify(token, config.jwt.secret);
      logger.debug("Decoded token payload:", {
        userId: decoded.userId,
        email: decoded.email,
        role: decoded.role,
      });

      if (!decoded.userId) {
        throw new AuthorizationError("토큰에 userId가 없습니다.");
      }

      req.user = {
        id: sessionId,
        email: decoded.email,
        role: decoded.role,
        name: decoded.name,
      };

      logger.debug("User info set in request:", {
        id: req.user.id,
        email: req.user.email,
        role: req.user.role,
      });

      next();
    } catch (err) {
      logger.error("Token verification failed:", {
        error: err.message,
        name: err.name,
        stack: err.stack,
      });
      throw new AuthorizationError("유효하지 않은 토큰입니다.");
    }
  } catch (err) {
    logger.error("Auth middleware error:", {
      error: err.message,
      name: err.name,
      stack: err.stack,
    });

    // 에러 응답 형식 통일
    res.status(err.status || 401).json({
      success: false,
      error: {
        message: err.message,
        code: err.code || "AUTH_ERROR",
      },
    });
  }
};

module.exports = auth;
