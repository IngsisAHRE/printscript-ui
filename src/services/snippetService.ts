import api from './api';
import {SnippetOperations} from "../utils/snippetOperations.ts";
import {CreateSnippet, PaginatedSnippets, parseCompliance, Snippet, UpdateSnippet} from "../utils/snippet.ts";
import {User, UserFriendsDTO} from "../utils/users.ts";
import {Rule} from "../types/Rule.ts";
import {CreateTestCase, TestCase} from "../types/TestCase.ts";
import {TestCaseResult} from "../utils/queries.tsx";
import {FileType} from "../types/FileType.ts";
import {BACKEND_URL, RUNNER_URL} from "../utils/constants.ts";
import {RunSnippetDTO, RunSnippetResponse} from "../types/RunSnippetDTO.ts";

export class SnippetService implements SnippetOperations {
    async listSnippetDescriptors(page_number: number, page_size: number, snippetName?: string): Promise<PaginatedSnippets> {
        const response = await api.get(`${BACKEND_URL}/snippets`, {
            params: { page_number, page_size, snippetName }
        });
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        response.data.snippets = response.data.snippets.map(snippet => ({
            ...snippet,
            compliance: parseCompliance(snippet.status)
        }));
        return response.data;
    }

    async createSnippet(createSnippet: CreateSnippet): Promise<Snippet> {
        const response = await api.post<Snippet>(`${BACKEND_URL}/snippets`, createSnippet);
        return response.data;
    }

    async getSnippetById(id: string): Promise<Snippet | undefined> {
        const response = await api.get<Snippet>(`${BACKEND_URL}/snippets/${id}`);
        return response.data;
    }

    async updateSnippetById(id: string, updateSnippet: UpdateSnippet): Promise<Snippet> {
        const response = await api.put<Snippet>(`${BACKEND_URL}/snippets/${id}`, updateSnippet);
        return response.data;
    }

    async getUserFriends(name?: string): Promise<User[]> {
        const response = await api.get<UserFriendsDTO>(`${BACKEND_URL}/users`, {
            params: { name }
        });
        return response.data.users.map((user) => ({ id: user.user_id, name: user.nickname } as User));
    }

    async shareSnippet(snippetId: string, userId: string): Promise<Snippet> {
        const response = await api.post<Snippet>(`${BACKEND_URL}/snippets/share`, { userId, snippetId });
        return response.data;
    }

    async getFormatRules(): Promise<Rule[]> {
        const response = await api.get<Rule[]>(`${BACKEND_URL}/rules/FORMATTING`);
        return response.data;
    }

    async getLintingRules(): Promise<Rule[]> {
        const response = await api.get<Rule[]>(`${BACKEND_URL}/rules/LINTING`);
        return response.data;
    }

    async getTestCases(snippetId: string): Promise<TestCase[]> {
        const response = await api.get<TestCase[]>(`${BACKEND_URL}/tests/${snippetId}`);
        return response.data;
    }

    async formatSnippet(content: string, language: string): Promise<string> {
        const response = await api.post(`${BACKEND_URL}/run/format`, { content, language });
        return response.data;
    }

    async setRules() {
        await api.post(`${BACKEND_URL}/rules/default`)
    }

    async postTestCase(snippetId: string, testCase: Partial<TestCase>): Promise<TestCase> {
        const request: CreateTestCase = ({
            id: testCase.id,
            snippetId: snippetId, 
            name: testCase.name!,
            inputs: testCase.inputs! || [],
            expectedOutputs: testCase.expectedOutputs! || [],
            envs: testCase.envs?.split(';')
                .filter(pair => pair.trim() !== '')
                .map((pair) => {
                    const [key, value] = pair.split('=');
                    return { key: key.trim(), value: value.trim() }
                }) || []
            });
        const response = await api.post<TestCase>(`${BACKEND_URL}/tests`, request);
        return response.data;
    }

    async removeTestCase(id: string): Promise<string> {
        await api.delete(`${BACKEND_URL}/tests/${id}`);
        return id;
    }

    async deleteSnippet(id: string): Promise<string> {
        await api.delete(`${BACKEND_URL}/snippets/${id}`);
        return id;
    }

    async testSnippet(testCase: Partial<TestCase>): Promise<TestCaseResult> {
        console.log(testCase)
        const response = await api.post(`${BACKEND_URL}/tests/run/${testCase.id}`);
        return response.data.passed ? 'success' : 'fail';
    }

    async getFileTypes(): Promise<FileType[]> {
        const response = await api.get<FileType[]>(`${RUNNER_URL}/runner/languages`);
        return response.data
    }

    async modifyFormatRule(newRules: Rule[]): Promise<Rule[]> {
        const response = await api.put<Rule[]>(`${BACKEND_URL}/rules`, newRules.map(rule => ({
            id: rule.id,
            active: rule.isActive,
            value: rule.value,
         })));
        return response.data;
    }

    async modifyLintingRule(newRules: Rule[]): Promise<Rule[]> {
        const response = await api.put<Rule[]>(`${BACKEND_URL}/rules`, newRules.map(rule => ({ 
            id: rule.id,
            active: rule.isActive,
            value: rule.value,
         })));
        return response.data;
    }

    async execSnippet(input: RunSnippetDTO): Promise<RunSnippetResponse> {
        const response = await api.post<RunSnippetResponse>(`${RUNNER_URL}/runner/run`, input);
        return response.data;
    }
}

export const snippetOperationsService = new SnippetService();