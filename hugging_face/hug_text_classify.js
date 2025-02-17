import { HfInference } from '@huggingface/inference'

const hf = new HfInference(process.env.HUGGING_FACE_API_KEY)

const textToClassify = "This is the worst thing I ever saw"

const myclass = await hf.textClassification({
  //model: 'distilbert-base-uncased-finetuned-sst-2-english',
  model: 'SamLowe/roberta-base-go_emotions',
  inputs: textToClassify
})


console.log(myclass)