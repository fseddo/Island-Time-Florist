import React, {Component, Fragment} from 'react'
import {connect} from 'react-redux'
import {withRouter, Route, Switch, Redirect} from 'react-router-dom'
import { Login, Signup } from './components/AuthForm';
import AllFlowers from './components/AllFlowers';
import Home from './components/Home';
import {me} from './store'
import SingleFlower from './components/SingleFlower';
import SingleUser from './components/SingleUser';
import AllUsers from './components/AllUsers';
import CartView from './components/cartView';
import CheckoutSummary from './components/CheckoutSummary';
import ls from 'local-storage';
/**
 * COMPONENT
 */
class Routes extends Component {
  constructor(){
    super();
    if (!ls.get('cart')) {
      ls.set('cart', {cart: [], qty: 0});
  }
  }
  componentDidMount() {
    this.props.loadInitialData()
  }

  render() {
    const {isLoggedIn, isAdmin} = this.props


    return (
      <div className='main-container'>
        {isLoggedIn ? (
          isAdmin ? (
            //this is for admins only
          <Switch>
          <Route path="/home" component={Home} />
          <Route exact path = "/flowers" component={AllFlowers} />
          <Route exact path="/flowers/:flowersId" component={SingleFlower} />
          <Route exact path='/users' component={AllUsers} />
          <Route exact path='/users/:userId' component={SingleUser} />
          <Route exact path='/cart' component={CartView} />
          <Route exact path='/cart/checkout' component={CheckoutSummary} />
            <Redirect to="/home" />
          </Switch>
          ) :
        //for users not not admins
          <Switch>
          <Route path="/home" component={Home} />
          <Route exact path = "/flowers" component={AllFlowers} />
          <Route exact path="/flowers/:flowersId" component={SingleFlower} />
          <Route exact path='/cart' component={CartView} />
          <Route exact path='/cart/checkout' component={CheckoutSummary} />
            <Redirect to="/home" />
          </Switch>
        ) : (
          <Switch>
            <Route path='/' exact component={AllFlowers} />
            <Route path="/login" component={Login} />
            <Route path="/signup" component={Signup} />
            <Route exact path = "/flowers" component={AllFlowers} />
            <Route exact path="/flowers/:flowersId" component={SingleFlower} />
            <Route exact path='/users' component={AllUsers} />
            <Route exact path='/users/:userId' component={SingleUser} />
            <Route exact path='/cart' component={CartView} />
            <Route exact path='/cart/checkout' component={CheckoutSummary} />
          </Switch>
        )}
      </div>
    )
  }
}

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    // Being 'logged in' for our purposes will be defined has having a state.auth that has a truthy id.
    // Otherwise, state.auth will be an empty object, and state.auth.id will be falsey
    isLoggedIn: !!state.auth.id,
    isAdmin: state.auth.isAdmin
  }
}

const mapDispatch = dispatch => {
  return {
    loadInitialData() {
      dispatch(me())
    }
  }
}

// The `withRouter` wrapper makes sure that updates are not blocked
// when the url changes
export default withRouter(connect(mapState, mapDispatch)(Routes))
