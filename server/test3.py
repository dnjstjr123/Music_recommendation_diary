import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import CountVectorizer #텍스트 데이터 벡터화
from sklearn.metrics.pairwise import cosine_similarity #코사인유사도
import os
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
print(df['combined_features'])
#텍스트 데이터 벡터화 진행
cv = CountVectorizer()
count_matrix = cv.fit_transform(df["combined_features"]) # CSR(Compressed Sparse Row) Matrix 타입. (4802, 5900) 2 형태

# print(count_matrix)
# print(count_matrix.shape)

# 코사인 유사도 계산
cosine_sim = cosine_similarity(count_matrix)


def recommend_songs(user_artists, user_genres,  df):
    user_genre = ' '.join(user_genres)
    user_artist = ' '.join(user_artists)
    user_total = user_artist + " " + user_genre
    print(user_total)
    user_count_matrix = cv.transform([user_total])

    user_cosine_sim = cosine_similarity(user_count_matrix, count_matrix)
    print(user_cosine_sim)
    song_indices = np.argsort(user_cosine_sim[0])[::-1][:5]  # Get the top 5 most similar songs
    
    recommended_songs = df.iloc[song_indices][['name', 'singer', 'genres']]
    print(recommended_songs)


user_artists, user_genres = ["장정한", "유키스", "주윤하"], ["댄스", "랩/힙합", "아이돌"]

recommend_songs(user_artists, user_genres, df)