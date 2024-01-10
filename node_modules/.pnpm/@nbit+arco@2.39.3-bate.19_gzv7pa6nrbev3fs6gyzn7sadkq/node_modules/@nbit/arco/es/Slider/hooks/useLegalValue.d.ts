import { IntervalConfig } from './useInterval';
export default function useLegalValue(props: {
    isRange: boolean;
    min: number;
    max: number;
    onlyMarkValue: boolean;
    step: number;
    intervalConfigs: IntervalConfig[];
    marks: object;
}): {
    getLegalRangeValue: (val: number | number[]) => number[];
    getLegalValue: (val: number) => number;
    isLegalValue: (val: any) => boolean;
};
