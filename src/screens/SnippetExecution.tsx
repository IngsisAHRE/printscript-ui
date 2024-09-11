import {OutlinedInput} from "@mui/material";
import {highlight, languages} from "prismjs";
import Editor from "react-simple-code-editor";
import {SnippetBox} from "../components/snippet-table/SnippetBox.tsx";
import {useEffect, useState} from "react";
import {useExecSnippet} from "../utils/queries.tsx";

type RunSnippetProps = {
    content: string,
    setRunSnippet: (isRunning: boolean) => void;
    runSnippet: boolean;
}
export const SnippetExecution = ({ content, setRunSnippet, runSnippet } : RunSnippetProps ) => {
    const [input, setInput] = useState<string>("")
    const [output, setOutput] = useState<string>("");
    const [inputList, setInputList] = useState<string[]>([]);
    const {mutateAsync : execSnippet} = useExecSnippet();

    useEffect(() => {
        if (runSnippet) {
            setOutput("");
            execute(inputList);
        } else {
            setInputList([]);
        }
    },[runSnippet]);

    const handleEnter = (event: { key: string }) => {
        if (event.key === 'Enter' && input.trim() !== '') {
            const newInputList = [...inputList, input.trim()];
            setInputList(newInputList);
            setInput('');
            execute(newInputList);
            console.log(inputList)
        }
    };

    const execute = (inputList: string[]) => {
        execSnippet({
            content,
            language: "PRINTSCRIPT",
            version: "1.1",
            inputs:inputList,
            envs: [],
        }).then(response  => {
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
    }

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
        <OutlinedInput onKeyDown={handleEnter} value={input} onChange={e => setInput(e.target.value)} placeholder="Type here" fullWidth/>
      </>
    )
}