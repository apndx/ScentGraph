export function validateResponse(response: any): void {
  if (!response.ok) {
    switch (response.status) {
      case 400:
        handleBadRequestError(response)
        break
    }
  }
}

function handleBadRequestError(response: any): void {
  const body = response.body
  if (body.message) {
    throw new Error(body.message)
  } else {
    throw new Error(response.statusText)
  }
}

export function errorHandler(error: any): void {
  if (error.response) {
    throw new Error(error.response.data.error)
  } else if (error.request) {
    throw new Error(error.request)
  } else {
    throw new Error(error.message)
  }
}
