import {Box, Button, Flex, Input, Text} from "@chakra-ui/react";
import NDDropzone from "../nd-dropzone/nd-dropzone";
import {ChangeEvent, useEffect, useState} from "react";
import {KeyManager} from "@pokt-foundation/pocketjs-signer";
import {ForwardStepProps} from "@/components/stake-steps/step-props";


export type ImportNcWalletStepProps = {} & ForwardStepProps;

function ImportNcWalletStep({onNextStep}: ImportNcWalletStepProps) {

    const [nextStepEnabled, setNextStepEnabled] = useState(false)
    const [passphrase, setPassphrase] = useState('')
    const [keyString, setKeyString] = useState<string>('')
    const [filePrompt, setUploadFilePrompt] = useState('Click here or drag and drop your keyfile json.')
    const handlePassphraseInput = (event: ChangeEvent<HTMLInputElement>) => {
        setPassphrase(event.target.value)
    }

    const finishStep = async () => {
        try {
            const importedWallet = await KeyManager.fromPPK({password: passphrase, ppk: keyString})
            onNextStep({
                wallet: importedWallet,
            })
        } catch (e) {
            setUploadFilePrompt(`${filePrompt}, PPK malformed or passphrase invalid.`)
        }
    }

    useEffect(() => {
        setNextStepEnabled(passphrase.length > 0 && keyString.length > 0);
    }, [passphrase, keyString])


    const onKeyFileAdded = (e: File[]) => {
        const keyFile = e[0];
        const reader = new FileReader()
        reader.onabort = () => setUploadFilePrompt('json read aborted, try again')
        reader.onerror = () => setUploadFilePrompt('json read error, try again')
        reader.onload = async () => {
            setUploadFilePrompt(`Selected file: ${keyFile.name}`)
            setKeyString(reader.result as string)
        }
        reader.readAsText(keyFile);
    }

    return (
        <Box>
            <Text color="White" fontSize="20px" fontWeight="400">
                Import your non custodial wallet keyfile, and enter the decryption passphrase.
            </Text>

            <Box margin="2rem 0">
                <Text color="white" margin="1rem 0">
                    Passphrase
                </Text>
                <Input type="text" onChange={handlePassphraseInput} value={passphrase}/>
                <NDDropzone onDrop={onKeyFileAdded} acceptedFileType="json" prompt={filePrompt}/>
            </Box>
            <Flex width="100%" justify="flex-end">
                <Button
                    backgroundColor="#5C58FF"
                    onClick={finishStep}
                    isDisabled={!nextStepEnabled}
                    size="lg"
                    _hover={{backgroundColor: "#5C58FF"}}
                >
                    {"Next"}
                </Button>
            </Flex>
        </Box>

    );
}

export default ImportNcWalletStep;
