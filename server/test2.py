import os
import pandas as pd
import numpy as np

# 데이터셋 불러오기
csv_path = 'result.csv'
df = pd.read_csv(csv_path)

# 데이터셋 일부 컬럼만 선택
features = ['singer', 'genres']
music_data = df[features].fillna('')  # 결측값은 빈 문자열로 대체

# 사용자 입력 함수
def get_user_input():
    # 사용자 입력 받기
    favorite_artists = ["장정한", "유키스", "주윤하"]
    favorite_genres = ["댄스", "랩/힙합", "아이돌"]
    recent_songs = ["잊지말아요", "자꾸만", "모르겠어요", "비행소년 (Feat. 거미)", "비행운"]

    return favorite_artists, favorite_genres, recent_songs

# 유사도 계산 함수
def calculate_similarity(user_profile, music_data):
    # 사용자 프로필 벡터 생성
    user_vector = np.zeros(len(music_data))
    print(user_vector)

    for artist in user_profile[0]:
        for i in range(len(music_data)):
            if artist in music_data.loc[i, 'singer']:
                user_vector[i] += 1


    for genres_list in user_profile[1]:
        for i in range(len(music_data)):
            genre_matches = False
            for genre in genres_list:
                if genre in music_data.loc[i, 'genres']:
                    genre_matches = True
                    break
            user_vector[i] += genre_matches

    print(user_vector)
    # 각 곡에 대한 유사도 계산
    similarity = user_vector / (len(user_profile[0]) + len(user_profile[1]))

    print("유사도 출력:", similarity)

    return similarity

# 음악 추천 함수
def recommend_music(similarity_vector, music_data):
    # 코사인 유사도가 높은 순으로 음악 인덱스 정렬
    sorted_indices = np.argsort(similarity_vector)[::-1]

    # 상위 다섯 곡 선택
    top_five_indices = sorted_indices[:5]

    # 추천 결과 생성
    recommended_music = [music_data.index[i] for i in top_five_indices]

    print("추천된 음악 인덱스:", recommended_music)  # 디버깅을 위해 추가

    return recommended_music

# 사용자 입력 받기
user_profile = get_user_input()

# 유사도 계산
similarity_vector = calculate_similarity(user_profile, music_data)

# 음악 추천
recommended_music = recommend_music(similarity_vector, music_data)

# 결과 출력
print("\n음악 추천:")
for music_index in recommended_music:
    print(df.loc[music_index, 'name'])
