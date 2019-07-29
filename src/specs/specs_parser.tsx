import { connect } from 'react-redux';
import { useEffect } from 'react';
import { specParsed } from '../store/actions/specs';
import { bindActionCreators, Dispatch } from 'redux';

const SpecsSpecComponent: React.FunctionComponent<{}> = (props) => {
  const injected = props as DispatchProps;
  useEffect(() => {
    console.log('*** spec parser mounted ***', props);
    injected.specParsed();
  });
  return props.children ? (props.children as React.ReactElement) : null;
};

interface DispatchProps {
  specParsed: () => void;
}

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      specParsed,
    },
    dispatch,
  );

const mapStateToProps = () => ({});

export const SpecsParser = connect(
  mapStateToProps,
  mapDispatchToProps,
)(SpecsSpecComponent);
