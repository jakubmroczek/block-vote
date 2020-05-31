import { connect } from 'react-redux'
import { connectToBlockchain } from '../../actions'
import App from '../../components/App'

// TODO: Change the voter reducers - it sound stupid
const mapStateToProps = state => ({
  appplicationState: state.voter.appplicationState
})

const mapDispatchToProps = {
  connectToBlockchain
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
