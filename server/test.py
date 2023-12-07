import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import CountVectorizer #텍스트 데이터 벡터화
from sklearn.metrics.pairwise import cosine_similarity #코사인유사도
import os
import sys
import codecs
import json
from start import emotion_cos_recommendation
sys.stdin = codecs.getreader('utf-8')(sys.stdin.detach())
sys.stdout = codecs.getwriter('utf-8')(sys.stdout.detach())


data = sys.stdin.read()
jsonData = json.loads(data)
user_input= jsonData["content"]
result = emotion_cos_recommendation(user_input=user_input)
# print(result)

csv_path = 'result.csv'
df = pd.read_csv(csv_path)

features = ['singer', 'genres']

def combine_features(row):
    return row['singer']+" "+row['genres']

# 특성 결합하는 방식
df['genres'] = df['genres'].apply(lambda x: ' '.join(eval(x)))
for feature in features:
    df[feature] = df[feature].fillna('')

df["combined_features"] = df.apply(combine_features,axis=1)

#텍스트 데이터 벡터화 진행
cv = CountVectorizer()
count_matrix = cv.fit_transform(df["combined_features"]) # CSR(Compressed Sparse Row) Matrix 타입. (4802, 5900) 2 형태


# cosine_sim = cosine_similarity(count_matrix)


def recommend_songs(user_artists, user_genres,  df):
    user_genre = ' '.join(user_genres)
    user_artist = ' '.join(user_artists)
    user_total = user_artist + " " + user_genre
    
    user_count_matrix = cv.transform([user_total])
    
    user_cosine_sim = cosine_similarity(user_count_matrix, count_matrix)
    
    # Get song indices based on similarity
    song_indices = np.argsort(user_cosine_sim[0])[::-1][:5]  # Get the top 5 most similar songs
    
    # Print recommended songs
    recommended_songs = df.iloc[song_indices][['name', 'singer', 'genres']]
    return recommended_songs.to_json(orient='records')

user_artists, user_genres = [jsonData["singer1"], jsonData["singer2"], jsonData["singer3"]], [jsonData["genre1"], jsonData["genre2"], jsonData["genre3"]]

result = recommend_songs(user_artists, user_genres, df)

sys.stdout.write(result)
sys.stdout.flush()