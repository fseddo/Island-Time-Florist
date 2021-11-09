import React from 'react'
import axios from "axios"

export class AllFlowers extends React.Component{
    constructor(){
        super()
        this.state ={
            flowers: []
        } 
    }
    async componentDidMount () {
        const flowers = await axios.get("/api/plants")
        const data = flowers.data
        this.setState({flowers: data})
    }
    render(){
        if(this.state.flowers.length < 1){
            return (
                <h1>Loading...</h1>
            )
        }
        return (
            <div>
                {
                    this.state.flowers.map(flowerObj => {
                        return (
                            <div>
                                <div>{flowerObj.name}</div>
                                <div>{flowerObj.flowerType}</div>
                                <div>{flowerObj.flowerColor}</div>
                            </div>
                        )
                    })
                }
            </div>
        )

    }
}

