export type TestCase = {
    id: string;
    name: string;
    input?: string[];
    output?: string[];
    envVars?: string;
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