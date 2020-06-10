class ApiError extends Error {
  constructor(code, name, message, extras) {
    super(message);
    this.name = name;
    this.statusCode = code;
    Object.assign(this, extras);
  }
}



function UnauthorizedError(message, extras = {}) {
  return new ApiError(401, 'UnauthorizedError', message, extras);
}

function ForbiddenError(message, extras = {}) {
  return new ApiError(403, 'ForbiddenError', message, extras);
}

function ConflictError(message, extras = {}) {
  return new ApiError(409, 'ConflictError', message, extras);
}

module.exports = {
  UnauthorizedError,
  ForbiddenError,
  ConflictError,
}