import {OutlinedInput} from "@mui/material";
import {highlight, languages} from "prismjs";
import Editor from "react-simple-code-editor";
import {SnippetBox} from "../components/snippet-table/SnippetBox.tsx";
import {useCallback, useEffect, useState} from "react";
import {useExecSnippet} from "../utils/queries.tsx";
import {Snippet} from "../utils/snippet.ts";

type RunSnippetProps = {
    snippet: Snippet,
    setRunSnippet: (isRunning: boolean) => void,
    runSnippet: boolean,
}
export const SnippetExecution = ({snippet, setRunSnippet, runSnippet}: RunSnippetProps) => {
    const [input, setInput] = useState<string>("")
    const [output, setOutput] = useState<string>("");
    const [inputList, setInputList] = useState<string[]>([]);
    const {mutateAsync: execSnippet} = useExecSnippet();

    const execute = useCallback((inputList: string[]) => {
        execSnippet({
            content: snippet.content,
            language: snippet.language,
            inputs: inputList,
            envs: [],
        }).then(response => {
            if (output === response.outputs.join(`\n`)) {
                setInputList([]);
                setRunSnippet(false);
            }
            setOutput(response.outputs.join(`\n`));
        }).catch(error => {
            setOutput(error.response.data.output);
            setRunSnippet(false);
        });
        setInput("")
    }, [execSnippet, output, setRunSnippet, snippet.content, snippet.language]);

    useEffect(() => {
        if (runSnippet) {
            setOutput("");
            execute(inputList);
        } else {
            setInputList([]);
        }
    }, [execute, inputList, runSnippet]);

    const handleEnter = (event: { key: string }) => {
        if (event.key === 'Enter' && input.trim() !== '') {
            const newInputList = [...inputList, input.trim()];
            setInputList(newInputList);
            setInput('');
            execute(newInputList);
            console.log(inputList)
        }
    };

    return (
        <>
            <SnippetBox flex={1} overflow={"none"} minHeight={200} bgcolor={'black'} color={'white'} code={output}>
                <Editor
                    value={output}
                    padding={10}
                    onValueChange={(code) => setInput(code)}
                    highlight={(code) => highlight(code, languages.js, 'javascript')}
                    maxLength={1000}
                    style={{
                        fontFamily: "monospace",
                        fontSize: 17,
                    }}
                />
            </SnippetBox>
            <OutlinedInput onKeyDown={handleEnter} value={input} onChange={e => setInput(e.target.value)}
                           placeholder="Type here" fullWidth/>
        </>
    )
}