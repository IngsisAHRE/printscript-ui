export type TestCase = {
    id: string;
    name: string;
    inputs?: string[];
    expectedOutputs?: string[];
    envs?: string;
};

export type CreateTestCase = {
    id?: string;
    snippetId: string;
    name: string;
    inputs?: string[];
    expectedOutputs?: string[];
    envs?: Env[];
}

export type Env = {
    key: string;
    value: string;
}