import type { ComponentPropsWithoutRef, ReactElement } from 'react';
import React from 'react';

type SvgProps = ComponentPropsWithoutRef<'svg'>;

export const SvgMock = (props: SvgProps): ReactElement => {
  return React.createElement('svg', props);
};
