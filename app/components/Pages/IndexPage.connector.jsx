import {connect} from 'react-redux'
import {selectFastMode} from 'app/flux/selectors/me'
import {setFastMode} from 'app/flux/actions/me'
import IndexPage from './IndexPage'

const mapStateToProps = (state) => {
  return {
    loading: state.loadingBar,
    fastMode: selectFastMode(state),
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setFastMode: (fastMode) => dispatch(setFastMode(fastMode)),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(IndexPage)
