export function validateResponse(response: any): void {
  console.log('valid resp', response)
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
    console.log('BAD', body.message)
    console.log('BAD', body.errors)
    throw new Error(body.message)
  } else {
    console.log('BAD', response.statusText)
    throw new Error(response.statusText)
  }
}

export function errorHandler(error: any): void {
  console.log('ERROR')
  if (error.response) {
    throw new Error(error.response.data.error)
  } else if (error.request) {
    console.log('err req', error.request)
  } else {
    console.log('err', error.message)
  }
  console.log(error.config)
}
