from pipeline import load_model, predicts
from model import cosine_sim_output
import pandas as pd


def emotion_cos_recommendation(user_input : str = ""):
    analysis_result = predicts(user_input)
    if analysis_result:
        result = cosine_sim_output(analysis_result=analysis_result)
        top100 = [ (result.iloc[i]['singer'], result.iloc[i]['name'], result.iloc[i]['genres']) for i in range(len(result)) ]

        df = pd.DataFrame(top100, columns=['singer', 'name', 'genres'])

        df.to_csv('result.csv')

        return top100

    else:
        return []