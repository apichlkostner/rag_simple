import { HfInference } from '@huggingface/inference'

const hf = new HfInference(process.env.HUGGING_FACE_API_KEY)
const textToTranslate = "The black cat walks under the ladder."

const textTranslationResponse = await hf.translation({
  model: 'google-t5/t5-small',
  inputs: textToTranslate,
})

const translation = textTranslationResponse.translation_text
console.log("\ntranslation:\n")
console.log(translation)