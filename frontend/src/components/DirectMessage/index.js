

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Switch, useHistory, useParams } from "react-router-dom";





function DirectMessage({user}) {
    const {id} = useParams()
    const userId = user.id
    console.log('are yuou hitting the wrong route')
    return(
        <div>
            hello
        </div>
    )
}



export default DirectMessage
