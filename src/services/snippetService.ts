import api from './api';
import {SnippetOperations} from "../utils/snippetOperations.ts";
import { CreateSnippet, PaginatedSnippets, Snippet, UpdateSnippet, parseCompliance} from "../utils/snippet.ts";
import {FriendUserDTO, PaginatedUsers, User} from "../utils/users.ts";
import {Rule} from "../types/Rule.ts";
import {TestCase, CreateTestCase} from "../types/TestCase.ts";
import {TestCaseResult} from "../utils/queries.tsx";
import {FileType} from "../types/FileType.ts";
import {BACKEND_URL, RUNNER_URL} from "../utils/constants.ts";
import {RunSnippetDTO, RunSnippetResponse} from "../types/RunSnippetDTO.ts";

export class SnippetService implements SnippetOperations {
    async listSnippetDescriptors(page_number: number, page_size: number, snippetName?: string): Promise<PaginatedSnippets> {
        const response = await api.get(`${BACKEND_URL}/snippets`, {
            params: { page_number, page_size, snippetName }
        });
        // @ts-ignore
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

    async getUserFriends(name?: string, page_number?: number, page_size?: number): Promise<PaginatedUsers> {
        const response = await api.get<FriendUserDTO>(`${BACKEND_URL}/users`, {
            params: { name, page_number, page_size }
        });
        return {users: response.data.users.map((user) => ({ id: user.user_id, name: user.nickname } as User)), page: page_number || 1, page_size: page_size || 5, count: response.data.total};
    }

    async shareSnippet(snippetId: string, userId: string): Promise<Snippet> {
        const response = await api.post<Snippet>(`${BACKEND_URL}/snippets/share`, { userId, snippetId });
        return response.data;
    }

    async getFormatRules(): Promise<Rule[]> {
        const response = await api.get(`${BACKEND_URL}/rules/FORMATTING`);
        // @ts-ignore
        return response.data.map(rule => ({ ...rule, isActive: rule.active }));
    }

    async getLintingRules(): Promise<Rule[]> {
        const response = await api.get<Rule[]>(`${BACKEND_URL}/rules/LINTING`);
        // @ts-ignore
        return response.data.map(rule => ({ ...rule, isActive: rule.active }));
    }

    async getTestCases(snippetId: string): Promise<TestCase[]> {
        const response = await api.get<TestCase[]>(`${BACKEND_URL}/tests/${snippetId}`);
        return response.data;
    }

    async formatSnippet(content: string): Promise<string> {
        const response = await api.post<{ formattedSnippet: string }>(`${BACKEND_URL}/run/format`, { content });
        // @ts-ignore
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
            inputs: testCase.input! || [], 
            expectedOutputs: testCase.output! || [],
            envs: testCase.envVars?.split(';')
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
        return [{
            language: "printscript",
            extension: "prs",
        }];
    }

    async modifyFormatRule(newRules: Rule[]): Promise<Rule[]> {
        const response = await api.put<Rule[]>('${BACKEND_URL}/rules', newRules.map(rule => ({ 
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