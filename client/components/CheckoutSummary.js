import React from 'react'
import { connect } from 'react-redux';
import { me } from '../store/auth';
import { checkout, fetchCart } from '../store/cart';
import CartItem from './cartItem';
import ls from 'local-storage';
import OrderConfirmation from './OrderConfirmation';
import EmptyCart from './EmptyCart';
import { checkoutLocal } from '../store/LocalCart';

export class CheckoutSummary extends React.Component {
    constructor() {
        super();
        this.handlePlaceOrder = this.handlePlaceOrder.bind(this)
        this.state = {
            userType: '',
            cart: undefined,
            orderPlaced: false
        }
    }

    async componentDidMount() {
        const currentUser = await this.props.fetchMe();
        const userType = currentUser ? 'member' : 'guest';
        let cart = [];
        if (userType === 'guest') {
            cart = ls.get('cart');
        } else if (userType === 'member') {
            await this.props.fetchCart(this.props.userId);
            cart = this.props.cart;
        }

        this.setState({
            userType,
            cart
        });
    }

    async handlePlaceOrder() {
        // Clear current cart
        // Create new empty cart
        if (this.state.userType === 'guest') {
            ls.set('cart', { cart: [], qty: 0 })
            await this.props.checkoutLocal()
            this.setState({ orderPlaced: true })
        } else if (this.state.userType === 'member') {
            await this.props.checkout(this.props.userId)
        }
        this.setState({ orderPlaced: true })
    }

    render() {
        if (this.state.orderPlaced === true) {
            return (
                <OrderConfirmation />
            )
        }

        if (this.state.cart) {
            if (this.state.cart.length < 1) {
                return (
                    <EmptyCart />
                )
            }
        }
        else {
            return (
                <div>Loading...</div>
            )
        }

        let totalPrice = 0;
        let totalItems = 0;
        return (
            <main>
                <div className='CartContainer'>
                    <div className="CartTitleContainer">
                        <div className='CartTitle'>
                            <h1>Shipping Information</h1>
                        </div>
                    </div>
                    <div className='ShippingInfoContainer'>
                        {/* Shipping Information Form Here */}
                    </div>
                    <div className="CartTitleContainer">
                        <div className='CartTitle'>
                            <h1>Payment Information</h1>
                        </div>
                    </div>
                    <div className='PaymentInfoContainer'>
                        {/* Payment Information Form Here */}
                    </div>
                    <div className="CartTitleContainer">
                        <div className='CartTitle'>
                            <h1>Shopping Cart</h1>
                        </div>
                    </div>
                    <div className='cartItemsContainer'>
                        <ul className='cartUL'>
                            {this.state.cart.cart.map(item => {
                                { totalPrice = totalPrice + (item.price * item.quantity) }
                                { totalItems += item.quantity }
                                return (
                                    <li key={item.plantId}>
                                        <CartItem item={item} isCart={false} />
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                </div>
                <div className='PlaceOrderContainer'>
                    <div><button className='PlaceOrderButton' onClick={this.handlePlaceOrder}>Place Your Order</button><hr /></div>
                    <h1>Order Summary</h1>
                    <p>
                        {`Items (${totalItems}): $${(totalPrice / 100).toFixed(2)}`}<br />
                        {`Shipping & Handling: $0.00`}<br />
                    </p>
                    <p className='tax'>
                        {`Total before tax: $${(totalPrice / 100).toFixed(2)}`}<br />
                        {`Estimated tax to be collected: $0.00`}<br />
                    </p>
                    <h1 id='OrderTotal'>Order Total: ${(totalPrice / 100).toFixed(2)}</h1>

                </div>
            </main>
        )
    }
}

const mapState = (state) => {
    return {
        cart: state.cartReducer,
        userId: state.auth.id
    }
}

const mapDispatch = (dispatch) => {
    return {
        fetchCart: (id) => dispatch(fetchCart(id)),
        fetchMe: () => dispatch(me()),
        checkout: (id) => dispatch(checkout(id)),
        checkoutLocal: () => dispatch(checkoutLocal())
    }
}

export default connect(mapState, mapDispatch)(CheckoutSummary);