import * as React from 'react'
import { Route } from 'react-router-dom'


interface Props {
  exact?: boolean
  link: string
  path: string
  sensitive?: boolean
  strict?: boolean;
}

export const ExternalRedirect: React.FC<Props> = (props: Props) => {
  const { link, ...routeProps } = props;

  return (
    <Route
      {...routeProps}
      render={() => {
        window.location.replace(props.link)
        return null
      }}
    />
  )
}
