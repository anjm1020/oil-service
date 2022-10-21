export const ERR_CODE = {
    INVALID_PAGE: {code: 404, msg: "Invalid Page"},
    BAD_REQUEST: {code: 400, msg: "Bad Request"},
    INVALID_TARGET: {code: 400, msg: "Invalid Target"}
}

export const ErrorResponse = (err_code) => {
    return {
        status: ERR_CODE[err_code].code,
        errMsg : ERR_CODE[err_code].msg
    };
}