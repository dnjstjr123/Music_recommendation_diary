import torch.nn as nn
from torch.nn import BCEWithLogitsLoss
from transformers import ElectraModel, ElectraPreTrainedModel
from sklearn.metrics.pairwise import cosine_similarity
from transformers import ElectraTokenizer
from pprint import pprint
import numpy as np
import pandas as pd

class ElectraForMultiLabelClassification(ElectraPreTrainedModel):
    def __init__(self, config):
        super().__init__(config)
        self.num_labels = config.num_labels

        self.electra = ElectraModel(config)
        self.dropout = nn.Dropout(config.hidden_dropout_prob)
        self.classifier = nn.Linear(config.hidden_size, self.config.num_labels)
        self.loss_fct = BCEWithLogitsLoss()

        self.init_weights()

    def forward(
            self,
            input_ids=None,
            attention_mask=None,
            token_type_ids=None,
            position_ids=None,
            head_mask=None,
            inputs_embeds=None,
            labels=None,
    ):
        discriminator_hidden_states = self.electra(
            input_ids, attention_mask, token_type_ids, position_ids, head_mask, inputs_embeds
        )
        pooled_output = discriminator_hidden_states[0][:, 0]

        pooled_output = self.dropout(pooled_output)
        logits = self.classifier(pooled_output)

        outputs = (logits,) + discriminator_hidden_states[1:]  # add hidden states and attention if they are here

        if labels is not None:
            loss = self.loss_fct(logits, labels)
            outputs = (loss,) + outputs

        return outputs  # (loss), logits, (hidden_states), (attentions)


def cosine_sim_output(analysis_result):
    file_path = "new_new_music.csv"
    result = pd.read_csv(file_path, encoding='cp949')
    for i in analysis_result:
        a_list = i["scores"]
        b_list = i["labels"]
    new = pd.DataFrame([a_list], columns=b_list)

    new['anger'] = new['anger']+new['annoyance']+new['disgust']
    new['sadness'] = new['sadness']+new['grief']
    new['joy'] = new['joy']+new['amusement']
    new['confusion'] = new['confusion']+new['nervousness']
    new['disappointment'] = new['disappointment']+new['remorse']
    new['admiration'] = new['admiration']+new['surprise']

    new = new.drop(['annoyance','disgust','grief','amusement','nervousness','remorse','surprise'], axis=1)

    temp = result.iloc[:,[i for i in range(4,25)]]

    cosine_sim = cosine_similarity(temp[::1],[new.iloc[0]])
 
    indx = np.argsort(cosine_sim, axis=0)
    indx = indx[-100:] # top-K 

    topk = result.iloc[indx[0]]
    for i in indx[1::]:
        topk = pd.concat([topk, result.iloc[i]], axis=0)
    
    return topk


