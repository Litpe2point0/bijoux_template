


export function response_with_mess(isSuccess, title, mess, data) {

    const response = {
        success: isSuccess,
        mess: {
            color: isSuccess ? "success" : "danger",
            title: title,
            mess: mess,
        },
        data: data
    }
    // console.log("RESPONSE HERE",response)
    return response;
}