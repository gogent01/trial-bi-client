import { defaults as tsjPreset } from 'ts-jest/presets';
const jestConfig = {
    preset: 'ts-jest',
    watchPlugins: ['jest-watch-typeahead/filename', 'jest-watch-typeahead/testname'],
    testPathIgnorePatterns: ['utils.ts'],
    transform: Object.assign({}, tsjPreset.transform),
};
export default jestConfig;
