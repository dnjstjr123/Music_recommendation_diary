from transformers import ElectraTokenizer
from model import ElectraForMultiLabelClassification
from pprint import pprint
import torch
import numpy as np

def load_model():
    tokenizer = ElectraTokenizer.from_pretrained("monologg/koelectra-base-v3-goemotions")
    model = ElectraForMultiLabelClassification.from_pretrained("monologg/koelectra-base-v3-goemotions")
    return tokenizer, model


def predicts(text):
        tokenizer, model = load_model()
        textList= text.split('. ')
        result = [0] * 28 
        final = []
        for idx in range(len(textList)):
             bring = predict(textList[idx], tokenizer, model)            
             resulted = bring[0]["scores"]
             for i in range(len(resulted)):
                  result[i] += resulted[i]
             if idx == len(textList) - 1:
                final.append({"labels": bring[0]["labels"]})
        final[0]["scores"] = result

        return final
        # predict(user_input, tokenizer, model)


def predict(text, tokenizer, model):
    inputs = tokenizer(text,return_tensors="pt")
    outputs = model(**inputs)
    scores =  1 / (1 + torch.exp(-outputs[0]))
    threshold = 0
    result = []
    for item in scores:
        labels = []
        scores = []
        for idx, s in enumerate(item):
            if s > threshold:
                labels.append(model.config.id2label[idx])
                scores.append(s.item())
        result.append({"labels": labels, "scores": scores})
    return result