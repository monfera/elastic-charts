import { useEffect, useRef } from 'react';
import { Dispatch, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { upsertSpec, removeSpec } from './actions/specs';
import { Spec } from '../specs';

export interface DispatchFromProps {
  upsertSpec: (spec: Spec) => void;
  removeSpec: (id: string) => void;
}

function usePrevious(value: string) {
  const ref = useRef<string>();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

export function specComponentFactory<U extends Spec, D extends keyof U>(
  defaultProps: Pick<U, D | 'chartType' | 'specType'>,
) {
  const spec = (props: U & DispatchFromProps) => {
    // console.log('*** component start ***', { props, defaultProps });
    const prevId = usePrevious(props.id);
    const { removeSpec, upsertSpec, ...spec } = props;
    useEffect(() => {
      // console.log(`*** mount/update ${props.id} ***`);
      if (prevId && prevId !== props.id) {
        // console.log('--- removing previous ID', prevId, props.id);
        removeSpec(prevId);
      }
      upsertSpec(spec);
    });
    useEffect(
      () => () => {
        // console.log(`*** unmount ${props.id} ***`);
        removeSpec(props.id);
      },
      [],
    );
    return null;
  };
  spec.defaultProps = defaultProps;
  return spec;
}

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      upsertSpec,
      removeSpec,
    },
    dispatch,
  );

const mapStateToProps = () => ({});

export function getConnect() {
  return connect(
    mapStateToProps,
    mapDispatchToProps,
  );
}
