import {Env} from "./TestCase.ts";

export type RunSnippetDTO = {
    content: string,
    language: string,
    inputs: string[],
    envs: Env[],
}

export type RunSnippetResponse = {
    outputs:string[],
    errors:string[]
}