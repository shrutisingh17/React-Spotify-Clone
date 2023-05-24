import Create from './Create.js'
import Like from './Like.js'
import Install from './Install.js'
import Heart from './Heart'
import CD from './CD'

import React from 'react'

export default function Icon(props) {
    switch (props.name) {
        case 'Create':
            return <Create />
        case 'Heart':
            return <Heart {...props}/>
        case 'Like':
            return <Like {...props}/>
        case 'Install':
            return <Install {...props}/>
        case 'CD':
            return <CD />
        default:
            return null
    }
}
