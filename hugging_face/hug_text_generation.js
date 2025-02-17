import { HfInference } from '@huggingface/inference'

const hf = new HfInference(process.env.HUGGING_FACE_API_KEY)

const textToGenerate = "He walked into the woods, into the endless darkness "

const response = await hf.textGeneration({
    inputs: textToGenerate,
    model: "HuggingFaceH4/zephyr-7b-beta",
    temperature: 0.9
})

console.log(response)