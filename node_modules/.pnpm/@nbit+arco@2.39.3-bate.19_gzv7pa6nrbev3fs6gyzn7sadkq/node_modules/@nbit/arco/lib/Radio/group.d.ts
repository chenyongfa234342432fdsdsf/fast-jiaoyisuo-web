import React, { PropsWithChildren } from 'react';
import { RadioGroupProps, RadioGroupContextProps } from './interface';
export declare const RadioGroupContext: React.Context<RadioGroupContextProps>;
declare function Group(baseProps: PropsWithChildren<RadioGroupProps>): JSX.Element;
declare namespace Group {
    var displayName: string;
}
export default Group;
export { RadioGroupProps, RadioGroupContextProps };
