export function matchInput(state: any, value: string) {
  return (
    state.name.toLowerCase().indexOf(value.toLowerCase()) !== -1
  )
}

export function matchScentInput(state: any, value: string) {
  return (
    state.name.toLowerCase().indexOf(value.toLowerCase()) !== -1 ||
    state.brand.toLowerCase().indexOf(value.toLowerCase()) !== -1
  )
}
