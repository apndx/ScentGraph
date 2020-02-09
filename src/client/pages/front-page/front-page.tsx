import * as React from 'react'
import { DEFAULT_PROPS, EMPTY_STATE } from '../../utils'

export class FrontPage extends React.PureComponent<DEFAULT_PROPS, EMPTY_STATE> {
    constructor(props) {
        super(props)
    }

    public render(): JSX.Element {
        return (
            <div>
                <h1>Hello ScentGraph</h1>
            </div>
        )
    }
}
