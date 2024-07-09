# recommendation.py

import pandas as pd
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import random
import requests

def load_and_prepare_data(file_path):

    response = requests.get(file_path) 
    
    # print(response.status_code)

    # print(response.json())
    # Load dataset
    games = response.json()
    
    games = games.get('games', [])

    gamesdf = pd.DataFrame(games)

    gamesdf = gamesdf[['id', 'slug', 'name', 'description', 'tags', 'genreSlugs', 'platforms', 'esrb_rating', 'released', 'background_image']]

    gamesdf['genreSlugs'] = gamesdf['genreSlugs'].apply(lambda x: ', '.join(x))
    gamesdf['tags'] = gamesdf['tags'].apply(lambda tags: ', '.join(tag['name'] for tag in tags))

    # print(gamesdf[['slug']])

    # Create 'tags' column by combining 'plot' and 'Genres'
    gamesdf['combinedTags'] = gamesdf['description'] + gamesdf['genreSlugs'] + gamesdf['tags']

    # pd.set_option('display.max_colwidth', None)

    # print(gamesdf)
    
    # return gamesdf[['id', 'slug','combinedTags', 'description', 'tags', 'genreSlugs']]

    return gamesdf[['id', 'slug', 'name', 'description', 'tags', 'genreSlugs', 'platforms', 'esrb_rating', 'released', 'background_image', 'combinedTags']]

# load_and_prepare_data("https://us-central1-debugd1vas.cloudfunctions.net/app/api/games")

def compute_similarity(games):
    # Vectorize 'tags' column
    cv = CountVectorizer(max_features=20000, stop_words='english')
    vector = cv.fit_transform(games['combinedTags'].values.astype('U'))
    
    # Compute cosine similarity
    similarity = cosine_similarity(vector)
    
    return similarity

def recommend_games(favorite_games, games_data = load_and_prepare_data('https://us-central1-debugd1vas.cloudfunctions.net/app/api/allgames')):
    similarity_matrix = compute_similarity(games_data)
    all_recommendations = []
    
    for game in favorite_games:
        if game not in games_data['slug'].values:
            print(f"Game '{game}' not found in the dataset.")
            continue
        
        index = games_data[games_data['slug'] == game].index[0]
        distance = sorted(list(enumerate(similarity_matrix[index])), reverse=True, key=lambda x: x[1])
        
        # Get top 10 recommendations (excluding itself)
        recommended_games = [games_data.iloc[i[0]] for i in distance[1:11]]
        all_recommendations.extend(recommended_games)
    
    # Shuffle all recommendations
    random.shuffle(all_recommendations)

    recommendations_list = []
    for game in all_recommendations:
        recommendations_list.append({
            'id': game['id'],
            'slug': game['slug'],
            'name': game['name'],
            'tags': game['tags'],
            'genreSlugs': game['genreSlugs'],
            'description': game['description'],
            'background_image': game['background_image'],
            'esrb_rating': game['esrb_rating'],
            'platforms': game['platforms'],
            'released': game['released'],
        })
    
    return recommendations_list

# if __name__ == "__main__":
#     file_path = 'https://us-central1-debugd1vas.cloudfunctions.net/app/api/games'
#     games_data = load_and_prepare_data(file_path)
#     favorite_games = ["a-short-hike"]
    
#     recommendations = recommend_games(games_data, favorite_games)
#     for rec in recommendations:
#         print(rec)