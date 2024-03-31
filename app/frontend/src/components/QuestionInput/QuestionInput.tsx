import { useEffect, useState } from "react";
import { useMsal } from "@azure/msal-react";
import { Stack, TextField } from "@fluentui/react";
import { Button, Tooltip } from "@fluentui/react-components";
import { Send28Filled, SlideMicrophone24Regular, MicOff24Regular } from "@fluentui/react-icons";
import { isLoggedIn, requireAccessControl } from "../../authConfig";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

import styles from "./QuestionInput.module.css";

interface Props {
    onSend: (question: string) => void;
    disabled: boolean;
    initQuestion?: string;
    placeholder?: string;
    clearOnSend?: boolean;
}

export const QuestionInput = ({ onSend, disabled, placeholder, clearOnSend, initQuestion }: Props) => {
    const [question, setQuestion] = useState<string>("");
    const [isListening, setIsListening] = useState<boolean>(false);

    const { instance } = useMsal();
    const disableRequiredAccessControl = requireAccessControl && !isLoggedIn(instance);
    const sendQuestionDisabled = disabled || !question.trim() || disableRequiredAccessControl;

    const handleStartListening = () => {
        SpeechRecognition.startListening({ continuous: true });
    };

    const handleStopListening = () => {
        SpeechRecognition.stopListening();
    };

    const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();

    const handleResetTranscript = () => {
        resetTranscript();
    };

    useEffect(() => {
        if (initQuestion) {
            setQuestion(initQuestion);
        }
    }, [initQuestion]);

    useEffect(() => {
        // Update the question state whenever the transcript changes
        if (transcript) {
            setQuestion(transcript);
        }
    }, [transcript]);

    const sendQuestion = () => {
        if (disabled || !question.trim()) {
            return;
        }

        onSend(question);

        if (clearOnSend) {
            setQuestion("");
            resetTranscript();
        }
    };

    useEffect(() => {
        if (listening && !isListening) {
            setIsListening(true);
        } else if (!listening && isListening) {
            setIsListening(false);
            handleResetTranscript();
        }
    }, [listening, isListening]);

    const onQuestionChange = (_ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
        if (!newValue) {
            setQuestion("");
            handleResetTranscript();
        } else if (newValue.length <= 1000) {
            setQuestion(newValue);
        }
    };

    const onEnterPress = (ev: React.KeyboardEvent<Element>) => {
        if (ev.key === "Enter" && !ev.shiftKey) {
            ev.preventDefault();
            sendQuestion();
        }
    };

    if (!browserSupportsSpeechRecognition) {
        return <span>Browser does not support speech recognition.</span>;
    }

    const toggleListening = () => {
        if (isListening) {
            handleStopListening();
            sendQuestion();
            handleResetTranscript();
        } else {
            handleStartListening();
        }
        setIsListening(!isListening);
    };

    return (
        <Stack horizontal className={styles.questionInputContainer}>
            <TextField
                className={styles.questionInputTextArea}
                disabled={disableRequiredAccessControl || isListening}
                placeholder={placeholder}
                multiline
                resizable={false}
                borderless
                value={question}
                onChange={onQuestionChange}
                onKeyDown={onEnterPress}
            />
            <div className={styles.questionInputButtonsContainer}>
                <Tooltip content={isListening ? "Stop Voice Input" : "Start Voice Input"} relationship="label">
                    <Button
                        size="large"
                        icon={isListening ? <MicOff24Regular /> : <SlideMicrophone24Regular />}
                        disabled={disableRequiredAccessControl}
                        onClick={toggleListening}
                    />
                </Tooltip>
                <Tooltip content="Ask question" relationship="label">
                    <Button size="large" icon={<Send28Filled primaryFill="rgba(115, 118, 225, 1)" />} disabled={sendQuestionDisabled} onClick={sendQuestion} />
                </Tooltip>
            </div>
        </Stack>
    );
};
